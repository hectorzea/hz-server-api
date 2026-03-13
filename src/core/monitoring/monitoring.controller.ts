import { Controller, Get, Res } from "@nestjs/common";
import { MonitoringService } from "./monitoring.service";
import { Response } from "express";

@Controller()
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get("/metrics")
  async getMetrics(@Res() res: Response): Promise<void> {
    res.set("Content-Type", this.monitoringService.register.contentType);
    res.end(await this.monitoringService.getMetrics());
  }
}
