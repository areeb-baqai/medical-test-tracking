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

  // Handle preflight requests and CORS
  app.use((req: Request, res: Response, next: NextFunction) => {
    const origin: string | undefined = req.headers.origin;
    
    // Always set CORS headers
    res.setHeader('Access-Control-Allow-Origin', origin || allowedOrigins[0]);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, Origin, X-Requested-With');
    res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie');

    // Handle preflight
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    next();
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