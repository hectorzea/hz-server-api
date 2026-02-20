import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
//TODO: esto del monitoring
// import { MonitoringInterceptor } from "./monitoring/monitoring.interceptor";
// import { MonitoringService } from "./monitoring/monitoring.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  //TODO: Monitoring en PRD revisar clase /. contenido
  // app.useGlobalInterceptors(
  //   new MonitoringInterceptor(app.get(MonitoringService))
  // );
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.PORT ?? 3001);
}

bootstrap()
  .then(() => {
    console.log(`hz-api-server is up and running! PORT: ${process.env.PORT}`);
  })
  .catch((error) => {
    console.error("Error starting the server:", error);
  });
