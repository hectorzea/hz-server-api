import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MonitoringModule } from "./monitoring/monitoring.module";
import { ExtractorModule } from "./extractor/extractor.module";
// import { AiModule } from "./ai/ai.module";
import { ConfigModule } from "@nestjs/config";
import { TasksModule } from "./tasks/tasks.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MonitoringModule,
    ExtractorModule,
    // AiModule
    TasksModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
