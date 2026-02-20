import { Injectable, Logger } from "@nestjs/common";
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
    return this.taskModel.find({}).exec();
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) throw new TaskNotFoundError(id);
    return task;
  }

  async updateTaskById(id: string, body: Task): Promise<Task> {
    const task = await this.taskModel
      .findByIdAndUpdate(id, body, { new: true })
      .exec();
    if (!task) throw new TaskNotFoundError(id);
    return task;
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
    const deleteResult = await this.taskModel.findByIdAndDelete(id).exec();
    if (!deleteResult) throw new TaskNotFoundError(id);
    return {
      success: true,
      message: "Deleted"
    };
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
