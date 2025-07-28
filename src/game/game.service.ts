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
    myClassId?: string // para filtrar por tu clase
  ): Promise<WinRateMulliganResponse[]> {
    let unwindField: string;
    const initialMatch: InitialMatchProps = { myClassId: "" }; // Condiciones de filtro iniciales

    // 1. Determinar qué campo de mulligan analizar (Initial Cards / Discarded Cards)
    if (type === "initial") {
      unwindField = "$mulligan.initialCardsIds"; // Apunta al array de IDs de cartas iniciales
    } else {
      unwindField = "$mulligan.discardedCardsIds"; // Apunta al array de IDs de cartas descartadas
    }

    const pipeline = [
      { $match: initialMatch }, // 3. Primera etapa: Filtrar por clase si aplica
      { $unwind: unwindField }, // 4. Clave aquí: "Desglosar" el array
      {
        $group: {
          // 5. Agrupar por carta individual
          _id: unwindField, // El _id de cada grupo será el cardId
          totalGames: { $sum: 1 }, // Contar cuántas veces aparece esa carta
          wins: {
            $sum: {
              $cond: [{ $eq: ["$matchResult", MatchResultEnum.WIN] }, 1, 0]
            }
          } // Contar victorias
        }
      },
      {
        $project: {
          // 6. Proyección y Cálculo final
          myClassId,
          _id: 0,
          cardId: "$_id", // Renombrar _id a cardId
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
      }
      // { $sort: { winrate: -1 } } // 7. Ordenar por winrate (descendente)
    ];

    const results = await this.gameModel.aggregate(pipeline).exec();
    return results as WinRateMulliganResponse[];
  }
}
