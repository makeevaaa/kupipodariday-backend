import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private usersSvc: UsersService, private jwt: JwtService) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersSvc.findOne({ where: [{ username }, { email: username }] } as any);
    if (!user) return null;
    const ok = await bcrypt.compare(pass, user.password);
    if (ok) {
      const { password, ...rest } = user as any;
      return rest;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return { access_token: this.jwt.sign(payload) };
  }
}
