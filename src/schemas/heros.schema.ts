import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export default class Hero {
  @Prop()
  name: string;

  @Prop()
  realName: string;

  @Prop()
  isAvenger: boolean;
}

export const HeroSchema = SchemaFactory.createForClass(Hero);
