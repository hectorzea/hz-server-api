import { Module } from "@nestjs/common";
import { HearthstoneService } from "./hearthstone.service";
import { HearthstoneController } from "./hearthstone.controller";
import { HearthstoneApiModule } from "src/external-api/hearthstone.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Card, CardSchema } from "./schemas/card.schema";
import { GameModule } from "src/game/game.module";
import { ExtractorModule } from "src/extractor/extractor.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]),
    HearthstoneApiModule,
    GameModule,
    ExtractorModule
  ],
  providers: [HearthstoneService],
  controllers: [HearthstoneController],
  exports: [HearthstoneService]
})
export class HearthstoneModule {}
