import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import { JobOfferAiService } from "./job-offer-ai.service";
import { JobOfferRequestBody } from "./interfaces/job-offer.interface";

@Controller("ai")
export class JobOfferAiController {
  constructor(private readonly jobOfferAiService: JobOfferAiService) {}
  @Post("process-job")
  async processJob(@Body() body: JobOfferRequestBody) {
    try {
      const aiResponse = await this.jobOfferAiService.processJobPosting(
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
