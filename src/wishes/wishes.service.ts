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

  async copyWish(wishId: number, userId: number) {
    const wish = await this.repo.findOne({ where: { id: wishId } });
    if (!wish) throw new Error('not found');
    const newWish = this.repo.create({
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
      owner: { id: userId } as Partial<import('../users/user.entity').User>,
    });
    await this.repo.save(newWish);
    await this.updateOne(wish.id, { copied: (wish.copied || 0) + 1 } as Partial<import('./wish.entity').Wish>);
    return { ok: true };
  }
}
