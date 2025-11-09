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
    const u = await this.svc.findOne({ where: { id: req.user.id } });
    if (!u) return null;
    const { password, ...rest } = u as any;
    return rest;
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('me')
  async update(@Request() req, @Body() body: UpdateUserDto) {
    const u = await this.svc.updateOne(req.user.id, body);
    const { password, ...rest } = u as any;
    return rest;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me/wishes')
  async getOwnWishes(@Request() req) {
    return this.svc.findWishesByUser(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':username')
  async findOne(@Param('username') username: string) {
    const u = await this.svc.findByUsername(username);
    if (!u) return null;
    const { password, ...rest } = u as any;
    return rest;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':username/wishes')
  async getWishes(@Param('username') username: string) {
    return this.svc.findWishesByUsername(username);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('find')
  async findMany(@Body() body: FindUsersDto) {
    const users = await this.svc.findManyByQuery(body.query);
    return users.map((u:any) => {
      const { password, ...rest } = u;
      return rest;
    });
  }

  @Post('signup')
  async signup(@Body() dto: CreateUserDto) {
    const u = await this.svc.create(dto);
    const { password, ...rest } = u as any;
    return rest;
  }
}
