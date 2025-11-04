import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MonitoringInterceptor } from "./monitoring/monitoring.interceptor";
import { MonitoringService } from "./monitoring/monitoring.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalInterceptors(
    new MonitoringInterceptor(app.get(MonitoringService))
  );
  await app.listen(10000, "0.0.0.0");
}
//test
bootstrap()
  .then(() => {
    console.log(`Server is running on port ${process.env.PORT}`);
  })
  .catch((error) => {
    console.error("Error starting the server:", error);
  });
