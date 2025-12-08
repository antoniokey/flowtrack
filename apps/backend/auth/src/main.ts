import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import * as path from 'path';

import { AppModule } from './app.module';
import { AuthRpcExceptionFilter } from './core/filters/auth-rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'auth',
        protoPath: path.join(__dirname, '../src/auth/auth.proto'),
        url: process.env.AUTH_MICROSERVICE_GRPC_URL,
      },
    },
  );

  app.useGlobalFilters(new AuthRpcExceptionFilter());

  await app.listen();
}
bootstrap();
