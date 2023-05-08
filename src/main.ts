import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import {NestExpressApplication} from "@nestjs/platform-express";

(async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({ origin: '*' });

  app.use(express.static('../public/build/static'));

  await app.listen(3000);
})();
