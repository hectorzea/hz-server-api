import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit
} from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import { Card } from "./schemas/card.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  CardInfo,
  MatchResultRawData
} from "src/common/interfaces/hearthstone-cards.interface";
import { GameService } from "src/game/game.service";
import { Game, MatchResultEnum } from "src/game/schemas/game.schema";

@Injectable()
export class HearthstoneService implements OnModuleInit {
  constructor(
    @InjectModel(Card.name) private readonly cardModel: Model<Card>,
    private readonly gameService: GameService
  ) {}

  async onModuleInit() {
    await this.prePopulateCards();
  }

  async create(cardData: Card): Promise<Card> {
    const createdCard = new this.cardModel(cardData);
    return createdCard.save();
  }

  async getCardByName(cardName: string): Promise<Card | null> {
    try {
      return this.cardModel
        .findOne({ name: new RegExp("^" + cardName + "$", "i") })
        .exec();
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: "Error Interno"
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async saveMatchResults(body: MatchResultRawData): Promise<Game> {
    try {
      const initialCardsRawString = body.initialCards
        .split(",")
        .map((cardName) => cardName.trim())
        .map((cardName) => this.getCardByName(cardName));
      const discardedCardsRawString = body.discardedCards
        .split(",")
        .map((cardName) => cardName.trim())
        .map((cardName) => this.getCardByName(cardName));
      const initialCardsIdsResponse = await Promise.all(initialCardsRawString);
      const discardedCardsIdsResponse = await Promise.all(
        discardedCardsRawString
      );
      const initialCardsIds = initialCardsIdsResponse
        .map((c) => c?.id)
        .filter((e) => e !== undefined);
      const discardedCardsIds = discardedCardsIdsResponse
        .map((c) => c?.id)
        .filter((e) => e !== undefined);
      const payload: Game = {
        myClassId: body.myClassId,
        oponentClassId: body.classOponentId,
        numberOfTurns: parseInt(body.turnsDuration),
        matchResult: body.win ? MatchResultEnum.WIN : MatchResultEnum.LOSS,
        mulligan: {
          initialCardsIds,
          discardedCardsIds
        }
      };
      const matchResult = await this.gameService.create(payload);
      return matchResult;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: "Error Interno"
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async prePopulateCards(): Promise<void> {
    const cardsJsonPath = path.join(
      __dirname,
      "..",
      "..",
      "src",
      "hearthstone",
      "data",
      "cards.json"
    );
    const rawData = fs.readFileSync(cardsJsonPath, "utf8");
    const hearthstoneCards = JSON.parse(rawData) as CardInfo[];

    for (const card of hearthstoneCards) {
      const imageUrl = `https://art.hearthstonejson.com/v1/render/latest/enUS/512x/${card.id}.png`;

      const cardData = {
        id: card.id,
        name: card.name,
        imagenUrl: imageUrl
      };

      const existingCard = await this.cardModel
        .findOne({ id: cardData.id })
        .exec();
      if (!existingCard) {
        await this.create(cardData);
      }
    }
  }
}
