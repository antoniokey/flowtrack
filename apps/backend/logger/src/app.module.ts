import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/flowtrack'),
    LoggerModule,
  ],
  controllers: [],
})
export class AppModule { }
