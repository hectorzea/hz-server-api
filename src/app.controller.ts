import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ErrorGenericResponse } from "./shared/dto/error-response.dto";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Get("/")
  @ApiOperation({ summary: "Get all tasks" })
  @ApiResponse({
    status: 200,
    description: "Root path of HZ API",
    content: {
      "text/html": {
        schema: {
          type: "string",
          example: "Hello World!"
        }
      }
    }
  })
  @ApiResponse({
    status: 500,
    description: "Internal Server Error",
    type: ErrorGenericResponse
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
