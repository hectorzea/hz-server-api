import { Module } from "@nestjs/common";
import { HearthstoneApiService } from "./hearthstone.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    HttpModule.register({
      baseURL: process.env.HEARTHSTONE_API_URL,
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": process.env.RAPID_API_X_KEY
      }
    })
  ],
  providers: [HearthstoneApiService],
  exports: [HearthstoneApiService]
})
export class HearthstoneApiModule {}
