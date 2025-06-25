import { Module } from "@nestjs/common";
import { AiService } from "./ai.service";
import { AiController } from "./ai.controller";
import { ExtractorModule } from "src/extractor/extractor.module";
import { UtilityModule } from "src/common/shared/utility.module";

@Module({
  providers: [AiService],
  controllers: [AiController],
  exports: [AiService],
  imports: [ExtractorModule, UtilityModule]
})
export class AiModule {}
