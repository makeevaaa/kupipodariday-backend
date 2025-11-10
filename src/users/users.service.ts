import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  private stripPassword(u: User) {
    if (!u) return null;
    const { password, ...rest } = u as User;
    return rest as Omit<User, 'password'>;
  }

  async create(dto: CreateUserDto): Promise<Omit<User,'password'>> {
    const hash = await bcrypt.hash(dto.password, 10);
    const u = this.repo.create({ ...dto, password: hash });
    const saved = await this.repo.save(u);
    return this.stripPassword(saved);
  }

  async findManyByQuery(query: string) {
    const qb = this.repo.createQueryBuilder('user');
    qb.where('user.username ILIKE :q OR user.email ILIKE :q', { q: `%${query}%` });
    const users = await qb.getMany();
    return users.map(u => this.stripPassword(u));
  }

  async findOne(opts: FindOneOptions<User>, includePassword: true): Promise<User | null>;
  async findOne(opts: FindOneOptions<User>, includePassword?: false): Promise<Omit<User, "password"> | null>;
  async findOne(opts: FindOneOptions<User>, includePassword = false): Promise<User | Omit<User, "password"> | null> {
    const user = await this.repo.findOne(opts);
    if (!user) return null;
    return includePassword ? user : this.stripPassword(user);
  }

  async getOwnWishes(userId: number) {
    const user = await this.repo.findOne({ where: { id: userId }, relations: ['wishes'] });
    if (!user) return [];
    // strip passwords from nested objects if present
    return user.wishes;
  }

  async findPublicByUsername(username: string) {
    const user = await this.repo.findOne({ where: { username } });
    if (!user) return null;
    return this.stripPassword(user);
  }

  async getWishesByUsername(username: string) {
    const user = await this.repo.findOne({ where: { username }, relations: ['wishes'] });
    if (!user) return [];
    return user.wishes;
  }

  async updateOne(id: number, attrs: Partial<User>) {
    if ((attrs as unknown as {password?: string}).password) {
      attrs.password = await bcrypt.hash((attrs as unknown as {password?: string}).password, 10);
    }
    await this.repo.update(id, attrs);
    const updated = await this.repo.findOne({ where: { id } });
    return updated ? this.stripPassword(updated) : null;
  }

  async removeOne(id: number) {
    return this.repo.delete(id);
  }
}
