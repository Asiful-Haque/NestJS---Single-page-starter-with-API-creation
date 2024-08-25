import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HerosModule } from './heros/heros.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://asif:asiful@cluster0.uuprp.mongodb.net/heros-entry?retryWrites=true&w=majority&appName=Cluster0',
    ),
    HerosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
