import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { doubleCsrf } from 'csrf-csrf';

import { AppModule } from './app.module';

const whitelist = [process.env.FRONTEND_URL];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: whitelist,
  });

  const { doubleCsrfProtection } = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET,
    getSessionIdentifier: (req) => req.cookies['session-id'],
  });

  app.use(doubleCsrfProtection);

  const config = new DocumentBuilder()
    .setTitle('Flowtrack API')
    .setDescription('Flowtrack API description')
    .setVersion('1.0')
    .build();

  const doucmentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, doucmentFactory);

  await app.listen(3000);
}
bootstrap();
