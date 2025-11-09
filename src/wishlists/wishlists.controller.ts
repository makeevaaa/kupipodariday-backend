import { Controller, Post, Body, UseGuards, Request, Get, Param, Patch, Delete } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { DeepPartial } from 'typeorm';
import { User } from '../users/user.entity';
import { Wish } from '../wishes/wish.entity';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private svc: WishlistsService) {}

  @Get()
  findAll() {
    return this.svc.findMany({});
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() body: CreateWishlistDto, @Request() req) {
    const items = (body.itemsId || []).map((id) => ({ id } as DeepPartial<Wish>));
    return this.svc.create({ name: body.name, image: body.image, items, owner: ({ id: req.user.id } as DeepPartial<User>) });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne({ where: { id: parseInt(id) } });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateWishlistDto, @Request() req) {
    const items = (body.itemsId || []).map((id) => ({ id } as DeepPartial<Wish>));
    return this.svc.updateOne(parseInt(id), { name: body.name, image: body.image, items });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.svc.removeOne(parseInt(id));
  }
}
