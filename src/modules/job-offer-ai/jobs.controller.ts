import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { JobsService } from "./jobs.service";

@Controller("api/jobs")
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post("/")
  create(@Body("url") url: string) {
    return this.jobsService.create(url);
  }

  @Get()
  findAll() {
    // return this.jobsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    // return this.jobsService.findOne(id);
  }

  @Post(":id/retry")
  retry(@Param("id") id: string) {
    // return this.jobsService.retry(id);
  }
}
