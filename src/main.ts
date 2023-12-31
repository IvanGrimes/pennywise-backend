import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  BadRequestException,
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: 'http://localhost:5173', credentials: true },
  });
  const reflector = app.get(Reflector);
  const configService = app.get(ConfigService);
  const options = new DocumentBuilder().build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: '/docs/schema.json',
    yamlDocumentUrl: '/docs/schema.yaml',
  });
  app.use(cookieParser(configService.get('COOKIE_SECRET')));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors) =>
        new BadRequestException(
          errors.reduce<Record<string, string>>(
            (acc, { property, constraints }) => {
              acc[property] = constraints
                ? Object.values(constraints)[0]
                : 'error';

              return acc;
            },
            {},
          ),
        ),
    }),
  );
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector, {
      excludeExtraneousValues: true,
    }),
  );

  app.enableShutdownHooks();

  await app.listen(configService.get('PORT') as number);
}

bootstrap();
