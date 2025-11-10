import { Controller, Post, Body, Get, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private svc: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async findOwn(@Request() req) {
    return this.svc.findOne({ where: { id: req.user.id } });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me/wishes')
  async getOwnWishes(@Request() req) {
    return this.svc.getOwnWishes(req.user.id);
  }

  @Get(':username')
  async findOne(@Param('username') username: string) {
    return this.svc.findPublicByUsername(username);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':username/wishes')
  async getWishes(@Param('username') username: string) {
    return this.svc.getWishesByUsername(username);
  }

  @Post('find')
  async findMany(@Body() body: FindUsersDto) {
    return this.svc.findManyByQuery(body.query);
  }

  @Post('signup')
  async signup(@Body() dto: CreateUserDto) {
    return this.svc.create(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('me')
  async update(@Request() req, @Body() dto: UpdateUserDto) {
    return this.svc.updateOne(req.user.id, dto);
  }
}
