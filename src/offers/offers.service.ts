import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Offer } from './offer.entity';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private repo: Repository<Offer>,
    private wishesSvc: WishesService,
  ) {}

  async create(data: DeepPartial<Offer>) {
    const wish = await this.wishesSvc.findOne({ where: { id: (data.item as unknown as {id:number}).id } });
    if (!wish) throw new BadRequestException('Wish not found');
    if (wish.owner && (wish.owner as import('../users/user.entity').User).id === (data.user as import('../users/user.entity').User).id) {
      throw new BadRequestException('Cannot contribute to your own wish');
    }
    const amount = Number((data as unknown as {amount:number}).amount);
    if (Number(wish.raised) + amount > Number(wish.price)) {
      throw new BadRequestException('Amount exceeds the remaining price');
    }
    const o = this.repo.create(data as DeepPartial<Offer>);
    const saved = await this.repo.save(o);
    await this.wishesSvc.updateOne((wish as unknown as {id:number,raised:number}).id, { raised: Number((wish as unknown as {raised:number}).raised) + amount });
    return saved;
  }

  findMany(opts: import('typeorm').FindManyOptions<Offer>) {
    return this.repo.find(opts);
  }

  findOne(opts: import('typeorm').FindOneOptions<Offer>) {
    return this.repo.findOne(opts);
  }
}
