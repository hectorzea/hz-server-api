import { ApiProperty } from "@nestjs/swagger";
export class TaskNotFoundErrorResponse {
  @ApiProperty({ example: "Task by ID not found" })
  message!: string;

  @ApiProperty({ example: 404 })
  statusCode!: number;
}
