import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { HerosService } from './heros.service';

@Controller('heros')
export class HerosController {
  constructor(private readonly herosService: HerosService) {}

  @Get()
  getHeros() {
    return this.herosService.getHeros();
  }

  @Get(':id')
  async getHero(@Param('id') id: string) {
    return await this.herosService.getHero(id);
  }

  @Post()
  createHero(@Body() hero) {
    return this.herosService.createHero(hero);
  }

  @Put(':id')
  async editHero(@Param('id') id: string, @Body() heroDetails) {
    return this.herosService.editHero(id, heroDetails);
  }

  @Delete(':id')
  async deleteHero(@Param('id') id: string) {
    return await this.herosService.deleteHero(id);
  }
}
