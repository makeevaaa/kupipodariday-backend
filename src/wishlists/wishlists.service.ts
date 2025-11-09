import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Wishlist } from './wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(@InjectRepository(Wishlist) private repo: Repository<Wishlist>) {}

  create(data: DeepPartial<Wishlist>) {
    const w = this.repo.create(data);
    return this.repo.save(w);
  }

  findOne(opts) {
    return this.repo.findOne(opts);
  }

  findMany(opts) {
    return this.repo.find(opts);
  }

  async updateOne(id: number, attrs: DeepPartial<Wishlist>) {
    await this.repo.update(id, attrs);
    return this.repo.findOne({ where: { id } });
  }

  removeOne(id: number) {
    return this.repo.delete(id);
  }
}
