import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import Hero from 'src/schemas/heros.schema';

@Injectable()
export class HerosService {
  constructor(
    @InjectModel(Hero.name) private heroModel: mongoose.Model<Hero>,
  ) {}

  async getHeros() {
    return await this.heroModel.find().exec();
  }

  async getHero(id: string): Promise<Hero> {
    return await this.heroModel.findById(id).exec();
  }

  async createHero(heroDetails) {
    const { name, realName, isAvenger } = heroDetails; //object destructuring if want
    console.log('Name:', name);
    console.log('Real Name:', realName);
    console.log('Is Avenger:', isAvenger);

    const heroData = await this.heroModel.create(heroDetails);
    return heroData;
  }

  async editHero(
    id: string,
    heroDetails,
  ): Promise<{ updated: boolean; message?: string }> {
    const result = await this.heroModel
      .findByIdAndUpdate(id, heroDetails, { new: true })
      .exec();
    if (result) {
      return { updated: true, message: 'Hero updated successfully' };
    } else {
      return { updated: false, message: 'Hero not found' };
    }
  }

  async deleteHero(
    id: string,
  ): Promise<{ deleted: boolean; message?: string }> {
    const result = await this.heroModel.findByIdAndDelete(id).exec();
    if (result) {
      return { deleted: true };
    } else {
      return { deleted: false, message: 'Hero not found' };
    }
  }
}
