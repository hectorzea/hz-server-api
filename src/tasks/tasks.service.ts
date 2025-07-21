import { Injectable } from "@nestjs/common";

@Injectable()
export class TasksService {
  getTasks(): string {
    return "Tasks";
  }
}
