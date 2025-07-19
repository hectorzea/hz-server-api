import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MonitoringModule } from "./monitoring/monitoring.module";
import { ExtractorModule } from "./extractor/extractor.module";
// import { AiModule } from "./ai/ai.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MonitoringModule,
    ExtractorModule
    // AiModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
