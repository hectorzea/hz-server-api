import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HzServerApiLogger } from "src/core/logger/logger.service";
import * as cookieParser from "cookie-parser";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
//TODO: esto del monitoring
// import { MonitoringInterceptor } from "./monitoring/monitoring.interceptor";
// import { MonitoringService } from "./monitoring/monitoring.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(HzServerApiLogger);
  const configService = app.get(ConfigService);

  app.useLogger(logger);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove fields if they are not in the DTO
      forbidNonWhitelisted: true // throw error if we send extra fields
    })
  );

  //api spec
  const swaggerApiConfig = new DocumentBuilder()
    .setTitle("HZ Server API")
    .setDescription(
      "API description for all the endpoints regarding HZ Server Functionalities"
    )
    .setVersion("1.0")
    .addTag("Server APIs")
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerApiConfig);
  SwaggerModule.setup("api/docs", app, documentFactory);

  app.use(cookieParser());
  app.enableCors({
    origin: configService.get<string>("FRONTEND_API_URL"), // La URL exacta de tu frontend NextJS
    credentials: true // Esto es lo que permite que el navegador guarde y envíe la httpOnly cookie
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  logger.log(`hz-server-api running on port -> ${port}`, "Bootstrap");
}

bootstrap()
  .then(() => {})
  .catch((error) => {
    console.error("Error starting the server:", error);
  });
