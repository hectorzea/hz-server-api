import { Module } from "@nestjs/common";
import { GameService } from "./game.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Game, GameSchema } from "./schemas/game.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }])
  ],
  exports: [GameService],
  providers: [GameService]
})
export class GameModule {}
