import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CardDocument = Card & Document;

@Schema()
export class Card {
  @Prop({ required: true, unique: true })
  id: string; // 'BT_001', 'ULD_217'

  @Prop({ required: true })
  name: string; // Talanji Of The Graves

  @Prop({ required: true })
  dbfId: number;

  @Prop({ required: false })
  text: string;

  @Prop({ required: false })
  flavor: string;

  @Prop({ required: false })
  artist: string;

  @Prop({ required: false })
  attack: number;

  @Prop({ required: false })
  cardClass: string;

  @Prop({ required: false })
  collectible: boolean;

  @Prop({ required: false })
  cost: number;

  @Prop({ required: false })
  elite: boolean;

  @Prop({ required: false })
  faction: string;

  @Prop({ required: false })
  health: number;

  @Prop({ type: [String], required: true })
  mechanics: string[];

  @Prop({ required: false })
  rarity: string;

  @Prop({ required: true })
  set: string;

  @Prop({ required: false })
  type: string;

  @Prop({ required: true })
  imageUrl: string;
}

export const CardSchema = SchemaFactory.createForClass(Card);
