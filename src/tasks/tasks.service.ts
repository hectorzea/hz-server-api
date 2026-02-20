import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException
} from "@nestjs/common";
import { Model } from "mongoose";
import { Task } from "./schemas/task.schema";
import { InjectModel } from "@nestjs/mongoose";
import {
  TaskFileSystemError,
  TaskNotFoundError
} from "src/common/errors/tasks.error";
import * as path from "path";
import * as fs from "fs/promises";
import * as assert from "assert";

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>
  ) {}

  async getTasks(): Promise<Task[]> {
    try {
      return await this.taskModel.find({}).exec();
    } catch (error) {
      this.logger.error("Error on getting tasks", error);
      throw error;
    }
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) throw new TaskNotFoundError(id);
    return task;
  }

  async updateTaskById(id: string, body: Task): Promise<Task> {
    try {
      const task = await this.taskModel
        .findByIdAndUpdate(id, body, { new: true })
        .exec();
      if (!task) throw new TaskNotFoundError(id);
      return task;
    } catch (error) {
      this.logger.error("Error on getting tasks", error);
      throw error;
    }
  }

  createTask(taskData: Task) {
    assert(
      taskData !== null && taskData !== undefined,
      `Task Body can not be null`
    );
    const createdTask = new this.taskModel(taskData);
    return createdTask.save();
  }

  async deleteTask(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const deleteResult = await this.taskModel.findByIdAndDelete(id).exec();
      if (!deleteResult) throw new NotFoundException();
      return {
        success: true,
        message: "Deleted"
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `Task with ID ${id} not found =(`
        },
        HttpStatus.NOT_FOUND
      );
    }
  }
  //funciones que entran al sistema usualmente asincronas ya que llevan tiempo para no bloquear hilo principal
  async exportToFile(fileName: string): Promise<string> {
    try {
      const tasks = await this.taskModel.find({}).exec();
      const exportPath = path.join(process.cwd(), "public", fileName);
      const content = JSON.stringify(tasks, null, 2);
      await fs.writeFile(exportPath, content, "utf-8");
      return exportPath;
    } catch (error) {
      const sysErr = error as NodeJS.ErrnoException;
      console.log(`code --> ${sysErr.code}`);
      this.logger.error(
        `System Error al exportar: ${sysErr.code}`,
        sysErr.stack
      );
      throw new TaskFileSystemError(
        sysErr.code === "ENOENT"
          ? "directorio 'public' no existe"
          : sysErr.message
      );
    }
  }
  // simulateCrash(): void {
  //PARA TESTEAR UNCAUGHTEXCEPTION
  // setTimeout(() => {
  //   throw new Error("💥 Error fuera del ciclo async de Express");
  // }, 1000);
  //PARA TESTEAR UNCAUGHTEXCEPTION
  // Promise.reject(new Error("💥 Test unhandledRejection"));
  // }
}
