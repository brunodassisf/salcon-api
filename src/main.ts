import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'production';

  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(isProduction ? 3000 : 3001);
}
bootstrap();
