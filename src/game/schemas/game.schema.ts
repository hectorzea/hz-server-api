// backend/src/game/schemas/game.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export enum MatchResultEnum {
  WIN = "WIN",
  LOSS = "LOSS"
}

@Schema()
class Mulligan {
  // Esquema anidado, no necesita importar nada si es interno
  @Prop([String])
  initialCardsIds: string[];

  @Prop([String])
  discardedCardsIds: string[];
}

const MulliganSchema = SchemaFactory.createForClass(Mulligan);

@Schema({ timestamps: true })
export class Game {
  @Prop({ type: String, required: true })
  myClassId: string;

  @Prop({ type: String, required: true })
  oponentClassId: string;

  @Prop({ required: true })
  numberOfTurns: number;

  @Prop({ required: true, enum: MatchResultEnum })
  matchResult: MatchResultEnum;

  @Prop({ type: MulliganSchema })
  mulligan: Mulligan;
}

export type GameDocument = Game & Document;

export const GameSchema = SchemaFactory.createForClass(Game);

export interface WinRateMulliganResponse {
  cardId: string;
  totalGames: number;
  wins: number;
  winrate: number;
}

export interface InitialMatchProps {
  myClassId: string;
}
