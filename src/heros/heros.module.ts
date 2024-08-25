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
