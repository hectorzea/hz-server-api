import { Global, Module } from "@nestjs/common";
import { HzServerApiLogger } from "src/core/logger/logger.service";

@Global()
@Module({
  providers: [HzServerApiLogger],
  exports: [HzServerApiLogger]
})
export class LoggerModule {}
