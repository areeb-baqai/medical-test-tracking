import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NextFunction, Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = [
    'https://medical-test-tracking-backend.vercel.app',
    'https://medical-test-tracking.vercel.app',
    'http://localhost:3001'
  ];
  
  // Enable CORS
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Important for cookies/authentication
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Origin', allowedOrigins.join(', '));
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
      res.sendStatus(200);
    } else {
      next();
    }
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