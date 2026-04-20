import { ApiProperty } from "@nestjs/swagger";
import { TaskLabel, TaskPriority, TaskStatus } from "../enums/task.enum";

export class TaskResponseDto {
  @ApiProperty({ example: "64a7f9... (ID de Mongo)" })
  _id!: string;

  @ApiProperty({
    example: "Aprender Swagger",
    description: "Task title"
  })
  title!: string;

  @ApiProperty({
    example: TaskStatus.BACKLOG,
    enum: TaskStatus
  })
  status!: string;

  @ApiProperty({
    example: TaskLabel.DOCUMENTATION,
    enum: TaskLabel
  })
  label!: string;

  @ApiProperty({
    example: TaskPriority.HIGH,
    enum: TaskPriority
  })
  priority!: string;
}
