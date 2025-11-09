import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions, DeepPartial } from 'typeorm';
import { Wish } from './wish.entity';

@Injectable()
export class WishesService {
  constructor(@InjectRepository(Wish) private repo: Repository<Wish>) {}

  create(data: DeepPartial<Wish>) {
    const w = this.repo.create(data);
    return this.repo.save(w);
  }

  findOne(opts: FindOneOptions<Wish>) {
    return this.repo.findOne(opts);
  }

  findMany(opts: FindManyOptions<Wish>) {
    return this.repo.find(opts);
  }

  async updateOne(id: number, attrs: DeepPartial<Wish>) {
    await this.repo.update(id, attrs);
    return this.repo.findOne({ where: { id } });
  }

  removeOne(id: number) {
    return this.repo.delete(id);
  }

  async recent(take = 40) {
    return this.repo.find({ order: { createdAt: 'DESC' }, take });
  }

  async popular(take = 20) {
    return this.repo.find({ order: { copied: 'DESC' }, take });
  }
}
