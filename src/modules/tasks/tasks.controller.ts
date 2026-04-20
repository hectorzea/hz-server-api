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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse
} from "@nestjs/swagger";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskResponseDto } from "./dto/task-response.dto";
import { ErrorGenericResponse } from "src/shared/dto/error-response.dto";
import { TaskNotFoundErrorResponse } from "./dto/task-error-response.dto";

@Controller("api/tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  @Get("/")
  @ApiOperation({ summary: "Get all tasks" })
  @ApiResponse({
    status: 200,
    description: "List of tasks with success state",
    type: [TaskResponseDto]
  })
  @ApiResponse({
    status: 500,
    description: "Internal Server Error",
    type: ErrorGenericResponse
  })
  getTasks(): Promise<Task[]> {
    return this.tasksService.getTasks();
  }
  @Get(":id")
  @ApiOperation({ summary: "Get a task by a given ID" })
  @ApiParam({ name: "id", description: "MongoDB ID of the task" })
  @ApiResponse({
    status: 200,
    description: "Individual task with success state",
    type: TaskResponseDto
  })
  @ApiResponse({
    status: 404,
    description: "Task not found by id",
    type: TaskNotFoundErrorResponse
  })
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
  @ApiResponse({
    status: 500,
    description: "Internal Server Error",
    type: ErrorGenericResponse
  })
  saveTask(@Body() body: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(body);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update of task" })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({
    status: 200,
    description: "Task update success response",
    type: TaskResponseDto
  })
  @ApiResponse({
    status: 404,
    description: "Task not found by id",
    type: TaskNotFoundErrorResponse
  })
  updateTask(
    @Param("id") id: string,
    @Body() body: CreateTaskDto
  ): Promise<Task> {
    return this.tasksService.updateTaskById(id, body);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Deletion of task" })
  @ApiResponse({
    status: 200,
    description: "Task deletion success response",
    schema: {
      example: {
        success: true,
        message: "Deleted"
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: "Task not found by id",
    type: TaskNotFoundErrorResponse
  })
  deleteTask(
    @Param("id") id: string
  ): Promise<{ success: boolean; message: string }> {
    return this.tasksService.deleteTask(id);
  }

  @Get("export/file")
  @ApiOperation({ summary: "Exportar tareas a un archivo JSON" })
  @ApiQuery({
    name: "fileName",
    required: false,
    example: "my_tasks.json",
    description: "Name of the file to export"
  })
  @ApiResponse({
    status: 200,
    description: "File route exported",
    type: String
  })
  exportFile(@Query("fileName") fileName: string) {
    return this.tasksService.exportToFile(fileName ?? "tasks.json");
  }
}
