import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(dto: CreateUserDto): Promise<User> {
    const hash = await bcrypt.hash(dto.password, 10);
    const u = this.repo.create({ ...dto, password: hash });
    return this.repo.save(u);
  }

  findOne(where: FindOneOptions<User>) {
    return this.repo.findOne(where);
  }

  findByUsername(username: string) {
    return this.repo.findOne({ where: { username } });
  }

  findMany(options: FindManyOptions<User>) {
    return this.repo.find(options);
  }

  async findManyByQuery(query: string) {
    return this.repo.createQueryBuilder('user')
      .where('user.username ILIKE :q', { q: `%${query}%` })
      .orWhere('user.email ILIKE :q', { q: `%${query}%` })
      .getMany();
  }

  async findWishesByUser(userId: number) {
    const user = await this.repo.findOne({ where: { id: userId }, relations: ['wishes'] });
    return user?.wishes || [];
  }

  async findWishesByUsername(username: string) {
    const user = await this.repo.findOne({ where: { username }, relations: ['wishes'] });
    return user?.wishes || [];
  }

  async updateOne(id: number, attrs: Partial<User>) {
    if ((attrs as any).password) {
      attrs.password = await bcrypt.hash((attrs as any).password, 10);
    }
    await this.repo.update(id, attrs);
    return this.repo.findOne({ where: { id } });
  }

  async removeOne(id: number) {
    return this.repo.delete(id);
  }
}
