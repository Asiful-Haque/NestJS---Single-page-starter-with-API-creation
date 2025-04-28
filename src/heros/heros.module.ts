import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import Hero, { HeroSchema } from 'src/schemas/heros.schema';
import { HerosController } from './heros.controller';
import { HerosService } from './heros.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hero.name, schema: HeroSchema }]),
  ],
  controllers: [HerosController],
  providers: [HerosService],
})
export class HerosModule {}



if want to add middleware
// src/middleware/logger.middleware.ts
import { Request, Response, NextFunction } from 'express';

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log('Request URL:', req.url);
  next();
}


// src/app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { loggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hero.name, schema: HeroSchema }]),
  ],
  controllers: [HerosController],
  providers: [HerosService],
})
  
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(loggerMiddleware) // ✅ function middleware
      .forRoutes('*');         // ✅ apply for all routes
  }
}
