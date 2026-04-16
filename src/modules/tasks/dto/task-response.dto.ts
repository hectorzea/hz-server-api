import { ApiProperty } from "@nestjs/swagger";

export class TaskResponseDto {
  @ApiProperty({ example: "64a7f9... (ID de Mongo)" })
  _id!: string;

  @ApiProperty({
    example: "Aprender Swagger",
    description: "Task title"
  })
  title!: string;

  @ApiProperty({
    example: "Bug",
    description: "Status of the task"
  })
  status!: string;

  @ApiProperty({
    example: "documentation",
    enum: ["bug", "feature", "epic", "documentation", "tech-debt"]
  })
  label!: string;

  @ApiProperty({
    example: "low",
    enum: ["low", "high", "medium"]
  })
  priority!: string;
}
