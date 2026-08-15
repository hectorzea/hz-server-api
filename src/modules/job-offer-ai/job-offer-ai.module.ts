import { Module } from "@nestjs/common";
// import { JobOfferAiService } from "./job-offer-ai.service";
// import { JobOfferAiController } from "./job-offer-ai.controller";
// import { ExtractorModule } from "src/modules/extractor/extractor.module";
import { JobsService } from "./jobs.service";
import { JobsController } from "./jobs.controller";
import { MongooseModule } from "@nestjs/mongoose";
import {
  JobApplication,
  JobApplicationSchema
} from "./schemas/job-application.schema";
import { ExtractorModule } from "../extractor/extractor.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JobApplication.name, schema: JobApplicationSchema }
    ]),
    ExtractorModule
  ],
  //CAMBIAR A JOBS CONTROLLER
  // providers: [JobOfferAiService],
  // controllers: [JobOfferAiController],
  // exports: [JobOfferAiService],
  providers: [JobsService],
  exports: [JobsService],
  controllers: [JobsController]
})
export class JobOfferAiModule {}
