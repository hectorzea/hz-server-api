import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MonitoringModule } from "./monitoring/monitoring.module";
import { ExtractorModule } from "./extractor/extractor.module";
// import { AiModule } from "./ai/ai.module";
import { ConfigModule } from "@nestjs/config";
import { TasksModule } from "./tasks/tasks.module";
import { HearthstoneModule } from "./hearthstone/hearthstone.module";
import { HearthstoneApiModule } from "./external-api/hearthstone.module";
import { MongooseModule } from "@nestjs/mongoose";
// import { GameModule } from "./game/game.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot("mongodb://localhost:27017/hs-server-api"),
    MonitoringModule,
    ExtractorModule,
    // AiModule
    TasksModule,
    HearthstoneModule,
    HearthstoneApiModule
    // GameModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
