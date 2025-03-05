import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NextFunction, Request, Response } from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  
  // Log cookies for debugging
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log('Request cookies:', req.cookies);
    next();
  });
  
  app.enableCors({
    origin: 'http://localhost:3001', // Your frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  await app.listen(3000);
}
bootstrap();