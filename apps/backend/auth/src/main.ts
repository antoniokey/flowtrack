import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { AuthRpcExceptionFilter } from './core/filters/auth-rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RMQ_URL],
        queue: process.env.AUTH_MICROSERVICE_RMQ_QUEUE,
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  app.useGlobalFilters(new AuthRpcExceptionFilter());

  await app.listen();
}
bootstrap();
