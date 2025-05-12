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



-------------------------------if want to add middleware----------------------------

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

export class HerosModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(loggerMiddleware).forRoutes(HerosController); // Apply only for this module
  }
}

// Apply for all module
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(loggerMiddleware) // ✅ function middleware
      .forRoutes('*');         // ✅ apply for all routes ,// Global Middleware
  }
}


------------------------------------------Bujhar jonno---------------------------------------------------
  but in express - (for core basic idea)
  
app.get('/profile', authMiddleware, logMiddleware, (req, res) => {
  console.log(req.user); // ✅ User info is now available
  res.send(`Hello, ${req.user.name}`);
});

1st - /profile
2nd - authMiddleware - its next will call the next middleware
3rd - logMiddleware - its next will call next route handler
4th - (req, res)


// Middleware 2: Authorization check (auth middleware)
app.use((req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token missing' }); 
  }
  const decoded_data = verifyToken(token, 'secret'); 
  if (!decoded_data) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' }); 
  }
  req.user = decoded_data; 
  next();  
});

