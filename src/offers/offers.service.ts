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
    const wish = await this.wishesSvc.findOne({ where: { id: (data.item as any).id } });
    if (!wish) throw new BadRequestException('Wish not found');
    if (wish.owner && (wish.owner as any).id === (data.user as any).id) {
      throw new BadRequestException('Cannot contribute to your own wish');
    }
    const amount = Number((data as any).amount);
    if (Number(wish.raised) + amount > Number(wish.price)) {
      throw new BadRequestException('Amount exceeds the remaining price');
    }
    const o = this.repo.create(data as DeepPartial<Offer>);
    const saved = await this.repo.save(o);
    await this.wishesSvc.updateOne((wish as any).id, { raised: Number(wish.raised) + amount } as DeepPartial<any>);
    return saved;
  }

  findMany(opts) {
    return this.repo.find(opts);
  }

  findOne(opts) {
    return this.repo.findOne(opts);
  }
}
