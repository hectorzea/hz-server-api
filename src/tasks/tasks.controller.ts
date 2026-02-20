import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from "@nestjs/common";
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

  @Patch(":id")
  updateTask(@Param("id") id: string, @Body() body: Task): Promise<Task> {
    return this.tasksService.updateTaskById(id, body);
  }

  @Delete(":id")
  deleteTask(
    @Param("id") id: string
  ): Promise<{ success: boolean; message: string }> {
    return this.tasksService.deleteTask(id);
  }
  //TODO ruta para validar errores de sistemas / archivos
  //TODO ruta para validar uncaught exception
}
