import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
// import { MonitoringModule } from "./monitoring/monitoring.module";
// import { ExtractorModule } from "./extractor/extractor.module";
import { AiModule } from "./ai/ai.module";
import { ConfigModule } from "@nestjs/config";
import { TasksModule } from "./tasks/tasks.module";
import { HearthstoneModule } from "./hearthstone/hearthstone.module";
// import { HearthstoneApiModule } from "./external-api/hearthstone.module";
import { MongooseModule } from "@nestjs/mongoose";
// import { GameModule } from "./game/game.module";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { LoggerModule } from "./logger/logger.module";
import { APP_FILTER } from "@nestjs/core";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot({ wildcard: true }),
    MongooseModule.forRoot(process.env.MONGO_DB_CLUSTER_URL!),
    TasksModule,
    HearthstoneModule,
    AiModule
    // HearthstoneApiModule
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
