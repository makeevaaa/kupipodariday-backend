import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { Wish } from './wish.entity';
import { UsersModule } from '../users/users.module';
import { Offer } from '../offers/offer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wish, Offer]), UsersModule],
  providers: [WishesService],
  controllers: [WishesController],
  exports: [WishesService],
})
export class WishesModule {}
