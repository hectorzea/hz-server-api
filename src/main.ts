import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HzServerApiLogger } from "src/core/logger/logger.service";
import * as cookieParser from "cookie-parser";
import { ConfigService } from "@nestjs/config";
//TODO: esto del monitoring
// import { MonitoringInterceptor } from "./monitoring/monitoring.interceptor";
// import { MonitoringService } from "./monitoring/monitoring.service";

async function bootstrap() {
  const logger = new HzServerApiLogger();
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.use(cookieParser());
  app.enableCors({
    origin: configService.get<string>("FRONTEND_API_URL"), // La URL exacta de tu frontend NextJS
    credentials: true // Esto es lo que permite que el navegador guarde y envíe la httpOnly cookie
  });

  //TODO: Monitoring en PRD revisar clase /. contenido
  // app.useGlobalInterceptors(
  //   new MonitoringInterceptor(app.get(MonitoringService))
  // );
  // process.on("uncaughtException", (err: Error) => {
  //   logger.error(
  //     `UNCAUGHT EXCEPTION — Closing Process: ${err.message}`,
  //     err.stack,
  //     "Process"
  //   );
  //   process.exit(1);
  // });

  // process.on("unhandledRejection", (reason: unknown) => {
  //   const message = reason instanceof Error ? reason.message : String(reason);
  //   const stack = reason instanceof Error ? reason.stack : undefined;
  //   logger.error(`UNHANDLED REJECTION: ${message}`, stack, "Process");
  //   process.exit(1);
  // });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  logger.log(`hz-server-api running on port -> ${port}`, "Bootstrap");
}

bootstrap()
  .then(() => {
    console.log(`hz-api-server is up and running! PORT: ${process.env.PORT}`);
  })
  .catch((error) => {
    console.error("Error starting the server:", error);
  });
