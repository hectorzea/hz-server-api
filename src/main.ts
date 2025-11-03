import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MonitoringInterceptor } from "./monitoring/monitoring.interceptor";
import { MonitoringService } from "./monitoring/monitoring.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalInterceptors(
    new MonitoringInterceptor(app.get(MonitoringService))
  );
  const host = "0.0.0.0";
  await app.listen(process.env.PORT ?? 3001, host);
}
//test
bootstrap()
  .then(() => {
    console.log(`Server is running on port ${process.env.PORT ?? 3001}`);
  })
  .catch((error) => {
    console.error("Error starting the server:", error);
  });
