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

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_DB_CLUSTER_URL!),
    AiModule,
    TasksModule,
    HearthstoneModule
    // HearthstoneApiModule
    // GameModule
    // MonitoringModule,
    // ExtractorModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
