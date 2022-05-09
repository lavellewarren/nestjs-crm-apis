import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn']
        : ['debug', 'error', 'verbose', 'warn'],
  });

  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors();

  // Disable 304 cache
  app.set('etag', false);

  // Serve all routes on /api/*
  app.setGlobalPrefix('api');

  // Global validation pipe https://docs.nestjs.com/techniques/validation
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: configService.get('isProd'),
      whitelist: true,
      transform: true,
    }),
  );

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Acclaimedhw API')
    .setDescription('Acclaimedhw API documentation')
    .setVersion('1.0')
    .addTag('acclaimedhw')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // Start app
  const port = +process.env.APP_PORT || 3000;
  await app.listen(port);

  Logger.log(
    `[${process.env.NODE_ENV || 'development'}] Listening on ${port}`,
    'BOOSTRAP',
  );
}
bootstrap();
