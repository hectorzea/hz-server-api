import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength
} from "class-validator";
import { TaskLabel, TaskPriority, TaskStatus } from "../enums/task.enum";

export class CreateTaskDto {
  @IsOptional()
  _id?: string;

  @ApiProperty({
    example: "Aprender Swagger",
    description: "Task title"
  })
  @IsString()
  @IsNotEmpty({ message: "Title can not be empty" })
  @MinLength(3, { message: "Title must have at least 3 characters" })
  title!: string;

  @ApiProperty({
    example: TaskStatus.BACKLOG,
    enum: TaskStatus
  })
  @IsEnum(TaskStatus)
  status!: string;

  @ApiProperty({
    example: TaskLabel.BUG,
    enum: TaskLabel
  })
  @IsEnum(TaskLabel)
  label!: string;

  @ApiProperty({
    example: TaskPriority.LOW,
    enum: TaskPriority
  })
  @IsEnum(TaskPriority)
  priority!: string;
}
