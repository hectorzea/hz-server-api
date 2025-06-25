import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import { ExtractorService } from "./extractor.service";

@Controller("job-extractor") // El path base para este controlador
export class ExtractorController {
  constructor(private readonly extractorService: ExtractorService) {}

  @Get() // Esto creará el endpoint GET /job-extractor
  async extract(
    @Query("url") url: string // Parámetro de query 'url'
  ): Promise<{ url: string; content: string | null }> {
    if (!url) {
      throw new HttpException(
        'Both "url" and "selector" query parameters are required.',
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      //1-obtener html raw
      const content = await this.extractorService.extractJobContent(url);
      //2 cargar txt
      return { url, content };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "Error formating the job content"
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error
        }
      );
    }
  }
}
