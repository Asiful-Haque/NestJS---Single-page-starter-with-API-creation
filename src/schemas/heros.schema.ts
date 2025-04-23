import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'actual_collection_name', strict: false })
export default class Hero {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  realName: string;

  @Prop({ type: Boolean, required: true })
  isAvenger: boolean;
}

export const HeroSchema = SchemaFactory.createForClass(Hero); // Hero is class name
