import { Module } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { TasksController } from "./tasks.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Task, TaskSchema } from "./schemas/task.schema";
import { TaskCreatedListener } from "./listeners/taskCreatedListeners";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }])
  ],
  providers: [TasksService, TaskCreatedListener],
  controllers: [TasksController],
  exports: [TasksService]
})
export class TasksModule {}
