import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

type TokenCard = {
  name: string;
  imagenUrl: string;
  id: string;
};

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
}

export const CardSchema = SchemaFactory.createForClass(Card);
