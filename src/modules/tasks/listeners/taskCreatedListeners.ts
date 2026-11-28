import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { TaskCreatedEvent } from "src/modules/tasks/events/taskCreated.event";

@Injectable()
export class TaskCreatedListener {
  private readonly logger = new Logger(TaskCreatedListener.name);
  constructor() {}

  @OnEvent("task.created")
  handleTaskCreatedEvent(event: TaskCreatedEvent) {
    this.logger.log(`✅ Task created → #${event.id} "${event.title}"`);
  }
}
