import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { HearthstoneService } from "./hearthstone.service";
import { Card } from "./schemas/card.schema";
import { MatchResultRawData } from "src/common/interfaces/hearthstone-cards.interface";
import { Game, WinRateMulliganResponse } from "src/game/schemas/game.schema";
import { GameService } from "src/game/game.service";
import { ExtractorService } from "src/extractor/extractor.service";

@Controller("api/hearthstone")
export class HearthstoneController {
  constructor(
    private readonly hearthstoneService: HearthstoneService,
    private readonly gameService: GameService,
    private readonly extractorService: ExtractorService
  ) {}
  @Get("cards")
  getCardByName(@Query("cardName") cardName: string): Promise<Card | null> {
    return this.hearthstoneService.getCardByName(cardName);
  }

  @Post("card-match-results")
  async saveMatchResults(@Body() body: MatchResultRawData): Promise<Game> {
    return this.hearthstoneService.saveMatchResults(body);
  }

  @Get("mulligan")
  getMulligan(): Promise<WinRateMulliganResponse[]> {
    return this.gameService.getMulliganWinratesForAllCards(
      "initial",
      "DEATHKNIGHT"
    );
  }

  @Get("scrape-mulligan")
  getScrappedMulliganCards(): Promise<any> {
    return this.extractorService.getMulliganCards();
  }
}
