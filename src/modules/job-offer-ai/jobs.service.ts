import { Injectable } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JobCreatedEvent } from "./events/job-created.event";
import {
  JobApplication,
  JobApplicationDocument,
  JobStatus
} from "./schemas/job-application.schema";
import { HzServerApiLogger } from "src/core/logger/logger.service";
import { AiInternalServerError } from "./errors/ai.error";
@Injectable()
export class JobsService {
  constructor(
    @InjectModel(JobApplication.name)
    private jobModel: Model<JobApplicationDocument>,
    private eventEmitter: EventEmitter2,
    private readonly logger: HzServerApiLogger
    // Inyecta aquí tus servicios de Scraper, AI y Cv
    // private scraperService: ScraperService,
    // private aiService: AiService,
    // private cvService: CvService,
  ) {}

  // 1. Endpoint handler: Crea registro y responde al instante
  async create(jobLink: string) {
    const job = await this.jobModel.create({ jobLink });

    // Dispara proceso en segundo plano (no bloquea HTTP response)
    this.eventEmitter.emit(
      "job.created",
      new JobCreatedEvent(job._id.toString())
    );

    return job;
  }

  @OnEvent("job.created", { async: true })
  async handleJobCreatedEvent(event: JobCreatedEvent) {
    const { jobId } = event;
    const job = await this.jobModel.findById(jobId);
    if (!job) return;
    try {
      if (!job.rawScrapedContent) {
        job.status = JobStatus.SCRAPING;
        await job.save();

        // TODO finalizar esto y investigar de mejor scrapping
        // job.rawScrapedContent = await this.scraperService.scrape(job.jobLink);
        job.rawScrapedContent = "Contenido extraído del scraper...";
        await job.save();
      }
    } catch (error) {
      const sysErr = error as NodeJS.ErrnoException;
      job.status = JobStatus.FAILED;
      //todo ver de no lekear
      job.lastError = sysErr.message;
      await job.save();

      this.logger.error(`Error de sistema: ${sysErr.code}`, sysErr.stack);
      throw new AiInternalServerError(sysErr.message);
    }
  }
}
