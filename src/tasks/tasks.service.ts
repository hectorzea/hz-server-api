import { Injectable } from "@nestjs/common";
import { Task } from "src/common/interfaces/tasks.interface";

@Injectable()
export class TasksService {
  getTasks(): Task[] {
    return [
      {
        _id: "67574211b5599f1ebce84868",
        title: "Do something with the tests",
        status: "done",
        label: "epic",
        priority: "high"
      }
    ];
  }
}
