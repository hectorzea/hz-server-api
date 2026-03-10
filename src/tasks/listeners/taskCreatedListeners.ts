import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { TaskCreatedEvent } from "../events/taskCreated.event";

@Injectable()
export class TaskCreatedListener {
  private readonly logger = new Logger("TaskEvents");
  @OnEvent("task.created")
  handleTaskCreatedEvent(event: TaskCreatedEvent) {
    this.logger.log(`✅ Task created → #${event.id} "${event.title}"`);
  }
}
