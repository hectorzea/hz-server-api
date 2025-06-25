import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit
} from "@nestjs/common";
import { promises as fs } from "fs";
import * as path from "path";
import { ExtractorService } from "../extractor/extractor.service"; // Importa el servicio del otro módulo
import { GoogleGenAI } from "@google/genai";
import { JobOffer } from "src/common/interfaces/job-offer.interface";
import { UtilityService } from "src/common/shared/utility.service";

@Injectable()
export class AiService implements OnModuleInit {
  private promptTemplate: string;
  private cvTemplate: string;
  constructor(
    private readonly extractorService: ExtractorService,
    private readonly utilityService: UtilityService
  ) {}

  async onModuleInit() {
    try {
      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "public/ai_job_analyzer_prompt.txt"
      );
      const filePathCV = path.join(__dirname, "..", "..", "public/my_cv.txt");
      this.promptTemplate = await fs.readFile(filePath, "utf8");
      this.cvTemplate = await fs.readFile(filePathCV, "utf8");
      console.log("[AiService] Templates loaded successfully.");
    } catch (error) {
      throw new Error("No se pudo cargar la plantilla de IA.", {
        cause: error
      });
    }
  }

  async processJobPosting(linkedinJobUrl: string): Promise<JobOffer> {
    if (!this.promptTemplate) {
      throw new Error("La plantilla de IA no ha sido cargada.");
    }

    const jobRawHtml =
      await this.extractorService.extractJobContent(linkedinJobUrl);

    let promptFinal = this.promptTemplate.replace(
      "{my_cv_data_placeholder}",
      this.cvTemplate
    );
    promptFinal = promptFinal.replace("{job_raw_html_placeholder}", jobRawHtml);

    const aiResponse = await this.callAiApi(promptFinal);

    return aiResponse;
  }

  private async callAiApi(prompt: string): Promise<JobOffer> {
    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GOOGLE_AI_API_KEY
      });
      console.log("Calling AI Api...");
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });
      const jobDetails = this.utilityService.parseRawTextToJson<JobOffer>(
        response.text || ""
      );
      return jobDetails;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "Error on calling the AI API"
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error
        }
      );
    }
  }
}
