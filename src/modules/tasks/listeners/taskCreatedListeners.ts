import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { TaskCreatedEvent } from "src/modules/tasks/events/taskCreated.event";
import { HzServerApiLogger } from "src/core/logger/logger.service";

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
