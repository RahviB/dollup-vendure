import { bootstrap } from '@vendure/core';
import { config } from './vendure-config';
import { NestExpressApplication } from '@nestjs/platform-express';

bootstrap(config).then(app => {
  const expressApp = app as NestExpressApplication;

  expressApp.set('trust proxy', 1); // 🔐 Fixes Coolify X-Forwarded-For error

  console.log('🚀 Vendure started with trust proxy enabled');
});
