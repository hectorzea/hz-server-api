import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { TaskCreatedEvent } from "../events/taskCreated.event";
import { HzServerApiLogger } from "src/logger/logger.service";

@Injectable()
export class TaskCreatedListener {
  constructor(private readonly logger: HzServerApiLogger) {}
  @OnEvent("task.created")
  handleTaskCreatedEvent(event: TaskCreatedEvent) {
    this.logger.log(
      `✅ Task created → #${event.id} "${event.title}"`,
      "TaskCreatedListener"
    );
  }
}
