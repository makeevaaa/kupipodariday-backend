import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';

@Controller()
export class AuthController {
  constructor(private auth: AuthService, private usersSvc: UsersService) {}

  @UseGuards(AuthGuard('local'))
  @Post('signin')
  async login(@Request() req) {
    return this.auth.login(req.user);
  }

  @Post('signup')
  async signup(@Body() body) {
    return this.usersSvc.create(body);
  }
}
