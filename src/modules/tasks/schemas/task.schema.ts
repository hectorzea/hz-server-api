import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export interface ITask {
  title: string;
  status: string;
  label: string;
  priority: string;
}

@Schema()
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  status: string;

  @Prop()
  label: string;

  @Prop({ required: true })
  priority: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
