import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch, Delete } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { DeepPartial } from 'typeorm';
import { User } from '../users/user.entity';

@Controller('wishes')
export class WishesController {
  constructor(private svc: WishesService) {}

  @Get('last')
  findLast() {
    return this.svc.recent();
  }

  @Get('top')
  findTop() {
    return this.svc.popular();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.svc.findOne({ where: { id: parseInt(id) } });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() body: CreateWishDto, @Request() req) {
    return this.svc.create({ ...body, owner: ({ id: req.user.id } as DeepPartial<User>) });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateWishDto, @Request() req) {
    return this.svc.updateOne(parseInt(id), body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.svc.removeOne(parseInt(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/copy')
  async copy(@Param('id') id: string, @Request() req) {
    const wish = await this.svc.findOne({ where: { id: parseInt(id) } });
    if (!wish) return { message: 'not found' };
    await this.svc.create({
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
      owner: ({ id: req.user.id } as DeepPartial<User>),
    });
    await this.svc.updateOne(wish.id, { copied: (wish.copied || 0) + 1 });
    return { ok: true };
  }
}
