import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const PORT = 5000;
  const config = new DocumentBuilder()
    .setTitle('JoiePalace API')
    .setDescription('HOHOHOHO')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'token',
    )
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
  console.log(`Application is running on: http://localhost:${PORT}/api`);
  console.log(`Application is running on: ${process.env.WEB_URL}`);
  console.log(`Swagger is running on: http://localhost:${PORT}/api`);
  console.log(`Swagger is running on: ${process.env.WEB_URL}api`);
}

bootstrap();