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
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskResponseDto } from "./dto/task-response.dto";

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
  @ApiOperation({ summary: "Creation of task" })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({
    status: 201,
    description: "Task creation success response",
    type: TaskResponseDto
  })
  @ApiResponse({
    status: 400,
    description: "Body validations not passed",
    schema: {
      example: {
        statusCode: 400,
        message: [
          "Title can not be empty",
          "Title must have at least 3 characters"
        ]
      }
    }
  })
  saveTask(@Body() body: CreateTaskDto): Promise<Task> {
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
