import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import { AiService } from "./ai.service";
import { JobOfferRequestBody } from "src/common/interfaces/job-offer.interface";

@Controller("ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}
  @Post("process-job")
  async processJob(@Body() body: JobOfferRequestBody) {
    try {
      const aiResponse = await this.aiService.processJobPosting(
        body.linkedinJobUrl
      );
      return aiResponse;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        "Error interno del servidor al procesar la solicitud.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
