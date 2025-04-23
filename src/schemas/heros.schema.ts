import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'actual_collection_name', strict: false })
export default class Hero {
  @Prop()
  name: string;

  @Prop()
  realName: string;

  @Prop()
  isAvenger: boolean;
}

export const HeroSchema = SchemaFactory.createForClass(Hero); // Hero is class name
