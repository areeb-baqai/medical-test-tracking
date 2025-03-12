import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NextFunction, Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: [
      'https://medical-test-tracking.vercel.app',
      'http://localhost:3001'
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  app.use(cookieParser());
  
  // Log cookies for debugging
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log('Request cookies:', req.cookies);
    next();
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();