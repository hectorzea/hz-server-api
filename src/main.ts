import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
// import { Logger } from "@nestjs/common";
//TODO: esto del monitoring
// import { MonitoringInterceptor } from "./monitoring/monitoring.interceptor";
// import { MonitoringService } from "./monitoring/monitoring.service";

async function bootstrap() {
  // const logger = new Logger("Bootstrap");
  const app = await NestFactory.create(AppModule, { cors: true });
  //TODO: Monitoring en PRD revisar clase /. contenido
  // app.useGlobalInterceptors(
  //   new MonitoringInterceptor(app.get(MonitoringService))
  // );
  app.useGlobalFilters(new AllExceptionsFilter());

  // process.on("uncaughtException", (err: Error) => {
  //   logger.error("UNCAUGHT EXCEPTION — Cerrando proceso", err.stack);
  //   process.exit(1);
  // });

  // process.on("unhandledRejection", (reason: unknown) => {
  //   logger.error("UNHANDLED REJECTION", reason);
  //   process.exit(1);
  // });

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap()
  .then(() => {
    console.log(`hz-api-server is up and running! PORT: ${process.env.PORT}`);
  })
  .catch((error) => {
    console.error("Error starting the server:", error);
  });
