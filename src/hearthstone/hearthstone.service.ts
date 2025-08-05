import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  OnModuleInit
} from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import { Card } from "./schemas/card.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  CardInfo,
  MatchResultRawData,
  ScrappedMatchResult
} from "src/common/interfaces/hearthstone-cards.interface";
import { Game } from "src/game/schemas/game.schema";
import { ExtractorService } from "src/extractor/extractor.service";
import { GameService } from "src/game/game.service";

@Injectable()
export class HearthstoneService implements OnModuleInit {
  private readonly logger = new Logger(HearthstoneService.name);
  constructor(
    @InjectModel(Card.name) private readonly cardModel: Model<Card>,
    private readonly extractorService: ExtractorService,
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

  async getInitialCardsIdsByCardNames(initialCardsNames: string[]) {
    const initialCardsFromModelPromise = initialCardsNames.map((cardName) =>
      this.getCardByName(cardName)
    );
    const initialCardsResponse = await Promise.all(
      initialCardsFromModelPromise
    );

    const initialCardsIds = initialCardsResponse
      .map((c) => c?.id)
      .filter((e) => e !== undefined);

    return initialCardsIds;
  }

  async getDiscardedCardsIdsByCardNames(cardNames: string[]) {
    const discardedCardsFromModelPromise = cardNames.map((cardName) =>
      this.getCardByName(cardName)
    );

    const discardedCardsResponse = await Promise.all(
      discardedCardsFromModelPromise
    );

    const discardedCardsIds = discardedCardsResponse
      .map((c) => c?.id)
      .filter((e) => e !== undefined);

    return discardedCardsIds;
  }

  async saveMatchResults(matchData: MatchResultRawData): Promise<Game> {
    try {
      this.logger.log(`Match URL: ${matchData.matchUrl}`);
      const scrappedDataFromMatchUrl: ScrappedMatchResult =
        await this.extractorService.scrapeMatchUrl(matchData);

      const initialCardsIds = await this.getInitialCardsIdsByCardNames(
        scrappedDataFromMatchUrl.initialCardsNames
      );

      const discardedCardsIds = await this.getDiscardedCardsIdsByCardNames(
        scrappedDataFromMatchUrl.discardedCardNames
      );

      const payload = {
        numberOfTurns: scrappedDataFromMatchUrl.numberOfTurns,
        myClassId: scrappedDataFromMatchUrl.myClassId,
        matchResult: scrappedDataFromMatchUrl.matchResult,
        oponentClassId: scrappedDataFromMatchUrl.oponentClassId,
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
