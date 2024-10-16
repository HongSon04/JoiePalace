import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT');
  const config = new DocumentBuilder()
    .setTitle('JoiePalace API')
    .setDescription('HOHOHOHO')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'Bearer',
      bearerFormat: 'JWT',
      in: 'header',
    })
    .addSecurityRequirements('token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(__dirname, '../', 'public'));
  app.setBaseViewsDir(join(__dirname, '../', 'templates'));
  app.setViewEngine('ejs');

  await app.listen(PORT);
  console.log(`Swagger is running on: http://localhost:${PORT}/api`);
  console.log(
    `Swagger is running on: ${configService.get<string>('BACKEND_URL')}api`,
  );
}

bootstrap();
