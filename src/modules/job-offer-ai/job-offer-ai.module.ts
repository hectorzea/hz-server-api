import { Module } from "@nestjs/common";
import { JobOfferAiService } from "./job-offer-ai.service";
import { JobOfferAiController } from "./job-offer-ai.controller";
import { ExtractorModule } from "src/modules/extractor/extractor.module";

@Module({
  providers: [JobOfferAiService],
  controllers: [JobOfferAiController],
  exports: [JobOfferAiService],
  imports: [ExtractorModule]
})
export class JobOfferAiModule {}
