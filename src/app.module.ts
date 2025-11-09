import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/user.entity';
import { Wish } from './wishes/wish.entity';
import { Wishlist } from './wishlists/wishlist.entity';
import { Offer } from './offers/offer.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'student',
      password: process.env.DB_PASSWORD || 'student',
      database: process.env.DB_DATABASE || 'kupipodariday',
      entities: [User, Wish, Wishlist, Offer],
      synchronize: true,
      logging: false,
    }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    AuthModule,
  ],
})
export class AppModule {}
