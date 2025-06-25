import { Module } from "@nestjs/common";
import { ExtractorService } from "./extractor.service";
import { ExtractorController } from "./extractor.controller";

@Module({
  providers: [ExtractorService],
  controllers: [ExtractorController],
  exports: [ExtractorService]
})
export class ExtractorModule {}
