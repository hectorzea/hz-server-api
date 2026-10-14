import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CvDocument = Cv & Document;

@Schema({ timestamps: true })
export class Cv {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  content!: string;

  @Prop({ default: false })
  isActive!: boolean;
}

export const CvSchema = SchemaFactory.createForClass(Cv);
