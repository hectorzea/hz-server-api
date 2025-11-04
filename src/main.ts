import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
//TODO: esto del monitoring
// import { MonitoringInterceptor } from "./monitoring/monitoring.interceptor";
// import { MonitoringService } from "./monitoring/monitoring.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  //TODO: Monitoring en PRD revisar clase /. contenido
  // app.useGlobalInterceptors(
  //   new MonitoringInterceptor(app.get(MonitoringService))
  // );
  await app.listen(process.env.PORT ?? 3001);
}

bootstrap()
  .then(() => {
    console.log(`hz-api-server is up and running! PORT: ${process.env.PORT}`);
  })
  .catch((error) => {
    console.error("Error starting the server:", error);
  });
