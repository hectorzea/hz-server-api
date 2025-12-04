import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

type TokenCard = {
  name: string;
  imagenUrl: string;
  id: string;
};

//TODO: hacer una sola estructura de tipos para carta - token
@Schema()
export class Card {
  @Prop({ required: true, unique: true })
  id: string; // Ejemplo: 'BT_001', 'ULD_217'

  @Prop({ required: true })
  name: string; // Nombre de la carta

  @Prop()
  imagenUrl: string; // URL a la imagen de la carta

  @Prop()
  tokens?: TokenCard[];

  @Prop()
  type: string;

  @Prop()
  collectible: boolean;

  @Prop()
  cardClass: string;

  @Prop()
  set: string;
}

export const CardSchema = SchemaFactory.createForClass(Card);
