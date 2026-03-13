import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { MonitoringService } from "./monitoring.service";
import { Request, Response } from "express";

@Injectable()
export class MonitoringInterceptor implements NestInterceptor {
  constructor(private readonly monitoringService: MonitoringService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(
        () => {
          const httpContext = context.switchToHttp();
          const request = httpContext.getRequest<Request>();
          const response = httpContext.getResponse<Response>();

          const route = request.url;
          const method = request.method;
          const statusCode = response.statusCode;

          this.monitoringService.incrementHttpRequestCounter(
            method,
            route,
            statusCode
          );
        },
        () => {
          const httpContext = context.switchToHttp();
          const request = httpContext.getRequest<Request>();
          const response = httpContext.getResponse<Response>();

          const route = request.url;
          const method = request.method;
          const statusCode = response.statusCode;

          this.monitoringService.incrementHttpRequestCounter(
            method,
            route,
            statusCode
          );
        }
      )
    );
  }
}
