import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum JobStatus {
  PENDING = "PENDING",
  SCRAPING = "SCRAPING",
  ANALYZING = "ANALYZING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED"
}

export type JobApplicationDocument = JobApplication & Document;
// todo generar un mock para aiResult y tiparlo y copiarmelo al frontend
@Schema({ timestamps: true })
export class JobApplication {
  _id!: Types.ObjectId;
  @Prop({ required: true })
  jobLink!: string;

  @Prop({ enum: JobStatus, default: JobStatus.PENDING })
  status!: JobStatus;

  @Prop({ type: String })
  rawScrapedContent?: string;

  @Prop({ type: Object })
  aiResult?: Record<string, any>;

  @Prop({ type: Types.ObjectId, ref: "Cv" })
  cvUsed?: Types.ObjectId;

  @Prop()
  lastError?: string;
}

export const JobApplicationSchema =
  SchemaFactory.createForClass(JobApplication);
