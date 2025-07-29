import { Injectable } from "@nestjs/common";
import {
  Game,
  GameDocument,
  InitialMatchProps,
  MatchResultEnum,
  WinRateMulliganResponse
} from "./schemas/game.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class GameService {
  constructor(@InjectModel(Game.name) private gameModel: Model<GameDocument>) {}
  async create(gameData: Game): Promise<Game> {
    const createdGame = new this.gameModel(gameData);
    return createdGame.save();
  }

  async getMulliganWinratesForAllCards(
    type: "initial" | "discarded", // iniciales o descartadas
    myClassId: string // para filtrar por tu clase
  ): Promise<WinRateMulliganResponse[]> {
    let unwindField: string;
    const initialMatch: InitialMatchProps = { myClassId }; // Condiciones de filtro iniciales

    // 1. Determinar qué campo de mulligan analizar (Initial Cards / Discarded Cards)
    if (type === "initial") {
      unwindField = "$mulligan.initialCardsIds"; // Apunta al array de IDs de cartas iniciales
    } else {
      unwindField = "$mulligan.discardedCardsIds"; // Apunta al array de IDs de cartas descartadas
    }

    const pipeline = [
      { $match: initialMatch },
      { $unwind: unwindField },
      {
        $group: {
          _id: unwindField,
          totalGames: { $sum: 1 },
          wins: {
            $sum: {
              $cond: [{ $eq: ["$matchResult", MatchResultEnum.WIN] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          cardId: "$_id",
          totalGames: 1,
          wins: 1,
          winrate: {
            $cond: {
              if: { $eq: ["$totalGames", 0] },
              then: 0,
              else: {
                $round: [
                  { $multiply: [{ $divide: ["$wins", "$totalGames"] }, 100] },
                  2
                ]
              }
            }
          }
        }
      },
      {
        // NUEVA ETAPA: $lookup para unir con la colección 'cards'
        $lookup: {
          from: "cards", // Nombre de la colección de cartas en MongoDB (NestJS la pluraliza)
          localField: "cardId", // El campo en el documento actual de la pipeline (del $project anterior)
          foreignField: "id", // El campo en la colección 'cards' que coincide con 'cardId'
          as: "cardDetails" // Nombre del nuevo array de campo que contendrá los detalles de la carta
        }
      },
      {
        // Puedes usar 'preserveNullAndEmptyArrays: true' si quieres mantener los documentos sin match. (cartas not found)
        $unwind: { path: "$cardDetails", preserveNullAndEmptyArrays: true }
      },
      {
        // NUEVA ETAPA: $project para seleccionar los campos finales y limpiar
        $project: {
          cardId: 1,
          totalGames: 1,
          wins: 1,
          winrate: 1,
          // Proyectar el nombre y la imagen de los detalles de la carta
          cardName: "$cardDetails.name",
          cardImageUrl: "$cardDetails.imagenUrl"
        }
      }
    ];

    const results = await this.gameModel.aggregate(pipeline).exec();
    return results as WinRateMulliganResponse[];
  }
}
