import { Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JobCreatedEvent } from "./events/job-created.event";
import {
  JobApplication,
  JobApplicationDocument,
  JobStatus
} from "./schemas/job-application.schema";
//TODO ERROR DE IMPORTS AQUI O ALGO CON LOS MODULOS
@Injectable()
export class JobsService {
  constructor(
    @InjectModel(JobApplication.name)
    private jobModel: Model<JobApplicationDocument>,
    private eventEmitter: EventEmitter2
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
}
