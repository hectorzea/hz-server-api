import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
// import { MonitoringModule } from "./monitoring/monitoring.module";
// import { ExtractorModule } from "./extractor/extractor.module";
import { JobOfferAiModule } from "src/modules/job-offer-ai/job-offer-ai.module";
import { ConfigModule } from "@nestjs/config";
import { TasksModule } from "src/modules/tasks/tasks.module";
import { HearthstoneModule } from "src/modules/hearthstone/hearthstone.module";
import { MongooseModule } from "@nestjs/mongoose";
// import { GameModule } from "./game/game.module";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { LoggerModule } from "src/core/logger/logger.module";
import { APP_FILTER } from "@nestjs/core";
import { AllExceptionsFilter } from "src/core/filters/all-exceptions.filter";
import { AuthModule } from "./modules/auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggerModule,
    EventEmitterModule.forRoot({ wildcard: true }),
    MongooseModule.forRoot(process.env.MONGO_DB_CLUSTER_URL!),
    TasksModule,
    HearthstoneModule,
    JobOfferAiModule,
    AuthModule
    // GameModule
    // MonitoringModule,
    // ExtractorModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // as we have dependencies in the exception filters constructor
    // we need to use APP_FILTER instead of app.useGlobal()
    { provide: APP_FILTER, useClass: AllExceptionsFilter }
  ]
})
export class AppModule {}
