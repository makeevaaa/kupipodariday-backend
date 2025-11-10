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

  @UseGuards(AuthGuard('jwt'))
  @Get('last')
  findLast() {
    return this.svc.recent();
  }

  @UseGuards(AuthGuard('jwt'))
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
    return this.svc.copyWish(parseInt(id), req.user.id);
  }
}
