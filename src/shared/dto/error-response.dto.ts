import { ApiProperty } from "@nestjs/swagger";
export class ErrorGenericResponse {
  @ApiProperty({ example: "An internal server error has ocurred" })
  message!: string;

  @ApiProperty({ example: 500 })
  statusCode!: number;
}
