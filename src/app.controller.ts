import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { MonitoringService } from "./monitoring/monitoring.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly monitoringService: MonitoringService
  ) {}

  @Get()
  getHello(): string {
    this.monitoringService.incrementHttpRequestCounter("GET", "/", 200);
    return this.appService.getHello();
  }
}
