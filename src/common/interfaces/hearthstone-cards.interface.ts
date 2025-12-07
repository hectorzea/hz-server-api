import { MatchResultEnum } from "src/game/schemas/game.schema";

export interface HearthstoneCardBodyRequest {
  cardName: string;
}

export interface MatchResult {
  myClassId: string;
  oponentClassId: string;
  numberOfTurns: number;
  matchResult: MatchResultEnum;
  mulligan: {
    initialCardsIds: string[];
    discardedCardsIds: string[];
  };
}

export interface MatchResultRawData {
  win: boolean;
  matchUrl: string;
}

export interface ScrappedMatchResult {
  numberOfTurns: number;
  myClassId: string;
  matchResult: MatchResultEnum;
  oponentClassId: string;
  discardedCardNames: string[];
  initialCardsNames: string[];
}
