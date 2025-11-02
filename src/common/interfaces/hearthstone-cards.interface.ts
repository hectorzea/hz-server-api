import { MatchResultEnum } from "src/game/schemas/game.schema";

export interface HearthstoneCardInfo {
  cardId: string;
  name: string;
  type: string;
  faction: string;
  cardSet: string;
  rarity: string;
  race: string;
  img: string;
  locale: string;
  tokens: HearthstoneCardInfo[];
  discover: string[];
  mechanics: CardMechanic[];
}
export interface HearthstoneCardBodyRequest {
  cardName: string;
}

interface CardMechanic {
  name: string;
}

export interface CardInfo {
  artist: string;
  attack: number;
  cardClass: string;
  collectible: boolean;
  cost: number;
  dbfId: number;
  flavor: string;
  health: number;
  id: string;
  mechanics: string[];
  name: string;
  race: string;
  races: string[];
  rarity: string;
  set: string;
  text: string;
  type: string;
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
