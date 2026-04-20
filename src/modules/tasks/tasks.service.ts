import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { Task } from "./schemas/task.schema";
import { InjectModel } from "@nestjs/mongoose";
import { TaskFileSystemError, TaskNotFoundError } from "./errors/tasks.error";
import * as path from "path";
import * as fs from "fs/promises";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { TaskCreatedEvent } from "./events/taskCreated.event";
import { HzServerApiLogger } from "src/core/logger/logger.service";

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    private readonly eventEmitter: EventEmitter2,
    private readonly logger: HzServerApiLogger
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

  async createTask(taskData: Task) {
    //saving task on mongo
    const createdTask = new this.taskModel(taskData);
    const savedTask = await createdTask.save();
    //event emit for task creation
    const taskCreatedEvent = new TaskCreatedEvent();
    taskCreatedEvent.id = savedTask._id.toString();
    taskCreatedEvent.title = savedTask.title;
    this.eventEmitter.emit("task.created", taskCreatedEvent);
    //return the task document
    return savedTask;
  }

  async deleteTask(id: string): Promise<{ success: boolean; message: string }> {
    const deleteResult = await this.taskModel.findByIdAndDelete(id).exec();
    if (!deleteResult) throw new TaskNotFoundError(id);
    return {
      success: true,
      message: "Deleted"
    };
  }
  async exportToFile(fileName: string): Promise<string> {
    try {
      const tasks = await this.taskModel.find({}).exec();
      const exportPath = path.join(process.cwd(), "public", fileName);
      const content = JSON.stringify(tasks, null, 2);
      await fs.writeFile(exportPath, content, "utf-8");
      return "Exported";
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
}
