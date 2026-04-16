import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { TaskLabel, TaskPriority, TaskStatus } from "../enums/task.enum";

@Schema()
export class Task {
  @Prop({ required: true })
  title!: string;

  @Prop({
    required: true,
    enum: Object.values(TaskStatus),
    default: TaskStatus.IN_PROGRESS
  })
  status!: string;

  @Prop({
    required: true,
    enum: Object.values(TaskLabel),
    default: TaskLabel.DOCUMENTATION
  })
  label!: string;

  @Prop({
    required: true,
    enum: Object.values(TaskPriority),
    default: TaskPriority.LOW
  })
  priority!: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
