import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)
  app.enableCors()
  app.setGlobalPrefix(configService.get('PATH_SUBDOMAIN') || 'api/v1')
  
  app.useGlobalPipes(
    new ValidationPipe (
      {
        whitelist:true,
        forbidNonWhitelisted:true
      }
    )
  );

  const port = configService.get('PORT')
  await app.listen(port);
}
bootstrap();
