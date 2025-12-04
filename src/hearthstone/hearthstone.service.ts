import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
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

  async getCardTokens(cardId: string): Promise<Card[] | null> {
    try {
      const idRegex = new RegExp(cardId, "i");
      //TODO: ver como filtrar cartas token de una mejor manera
      const cardTokens = await this.cardModel.find({ id: idRegex }).exec();
      cardTokens.shift();
      return cardTokens;
    } catch (error) {
      //todo loger
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `Error on obtaining card token`
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getCardByName(cardName: string): Promise<Card | null> {
    try {
      const card = await this.cardModel
        .findOne({ name: new RegExp("^" + cardName + "$", "i") })
        .exec();
      if (!card) throw new NotFoundException();
      return card;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `Card with name: ${cardName} not found`
        },
        HttpStatus.NOT_FOUND
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
    const cardsJsonPath = path.join(__dirname, "data", "cards.json");
    const rawData = fs.readFileSync(cardsJsonPath, "utf8");
    const hearthstoneCards = JSON.parse(rawData) as CardInfo[];
    for (const card of hearthstoneCards) {
      const imageUrl = `https://art.hearthstonejson.com/v1/render/latest/enUS/512x/${card.id}.png`;

      const cardData = {
        id: card.id,
        name: card.name,
        imagenUrl: imageUrl,
        type: card.type,
        collectible: card.collectible,
        cardClass: card.cardClass,
        set: card.set
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
