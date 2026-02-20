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
import { TaskNotFoundError } from "src/common/errors/tasks.error";

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>
  ) {}

  getTasks(): Promise<Task[]> {
    try {
      return this.taskModel.find({}).exec();
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
    //TODO check assert
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
}
