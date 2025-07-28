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
  matchResult: "WIN" | "DEFEAT";
  mulligan: {
    initialCardsIds: string[];
    discardedCardsIds: string[];
  };
}

export interface MatchResultRawData {
  myClassId: string;
  classOponentId: string;
  turnsDuration: string;
  win: boolean;
  initialCards: string;
  discardedCards: string;
}
