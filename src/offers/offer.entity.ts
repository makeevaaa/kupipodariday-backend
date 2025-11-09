import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Wish } from '../wishes/wish.entity';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (u) => u.offers, { eager: true })
  user: User;

  @ManyToOne(() => Wish, (w) => w.offers, { eager: true })
  item: Wish;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column({ default: false })
  hidden: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
