import { Controller, Post, Body, UseGuards, Request, Get, Param } from '@nestjs/common';
import { OffersService } from './offers.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateOfferDto } from './dto/create-offer.dto';
import { DeepPartial } from 'typeorm';
import { User } from '../users/user.entity';
import { Wish } from '../wishes/wish.entity';

@Controller('offers')
export class OffersController {
  constructor(private svc: OffersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() body: CreateOfferDto, @Request() req) {
    const offer = {
      user: { id: req.user.id } as DeepPartial<User>,
      item: { id: body.itemId } as DeepPartial<Wish>,
      amount: body.amount,
      hidden: !!body.hidden,
    };
    return this.svc.create(offer);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Request() req) {
    return this.svc.findMany({ where: { user: { id: req.user.id } } });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne({ where: { id: parseInt(id) } });
  }
}
