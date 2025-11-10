import { Injectable } from '@nestjs/common';
import { FindOneOptions } from 'typeorm';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private usersSvc: UsersService, private jwt: JwtService) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersSvc.findOne({ where: [{ username }, { email: username }]}, true);
    if (!user) return null;
    const ok = await bcrypt.compare(pass, user.password);
    if (ok) {
      const { password, ...rest } = user as User;
      return rest;
    }
    return null;
  }

  async login(user: {username:string,id:number}) {
    const payload = { username: user.username, sub: user.id };
    return { access_token: this.jwt.sign(payload) };
  }
}
