import { Controller, Get } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { Task } from "src/common/interfaces/tasks.interface";

@Controller("api/tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  @Get("/")
  getTasks(): Task[] {
    return this.tasksService.getTasks();
  }
}
