import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { Task } from "./schemas/task.schema";

@Controller("api/tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  @Get("/")
  getTasks(): Promise<Task[]> {
    return this.tasksService.getTasks();
  }
  @Get(":id")
  getTaskById(@Param("id") id: string): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Post("/")
  saveTask(@Body() body: Task): Promise<Task> {
    return this.tasksService.createTask(body);
  }
}
