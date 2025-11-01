import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { Model } from "mongoose";
import { Task } from "./schemas/task.schema";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>
  ) {}

  getTasks(): Promise<Task[]> {
    return this.taskModel.find({}).exec();
  }

  async updateTaskById(id: string, body: Task): Promise<Task> {
    console.log(id);
    try {
      const task = await this.taskModel
        .findByIdAndUpdate(id, body, { new: true })
        .exec();
      if (!task) throw new NotFoundException();
      return task;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `Task with ID ${id} not found =(`
        },
        HttpStatus.NOT_FOUND
      );
    }
  }

  async getTaskById(id: string): Promise<Task> {
    console.log(id);
    try {
      const task = await this.taskModel.findById(id).exec();
      if (!task) throw new NotFoundException();
      return task;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `Task with ID ${id} not found =(`
        },
        HttpStatus.NOT_FOUND
      );
    }
  }

  createTask(taskData: Task) {
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
