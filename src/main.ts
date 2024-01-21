import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as dotenv from 'dotenv';
const environment = process.env.NODE_ENV || 'development';
dotenv.config({ path: `${environment}.env` });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT);
}
bootstrap();
