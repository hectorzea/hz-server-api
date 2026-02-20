import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query
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
  @Get("export/file")
  exportFile(@Query("fileName") fileName: string) {
    return this.tasksService.exportToFile(fileName ?? "tasks.json");
  }

  // @Get("debug/crash")
  // simulateCrash() {
  //   this.tasksService.simulateCrash();
  //   return { message: "crash programado en 100ms" };
  // }
  //TODO ruta para validar errores de sistemas / archivos
  //TODO ruta para validar uncaught exception
}
