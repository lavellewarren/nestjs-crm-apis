import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import HomeOwnerOrder from './home_order.entity';

@Entity({ name: 'home_card_payments' })
export default class HomeCardPayment extends BaseEntity {
  @PrimaryGeneratedColumn()
  home_card_payment_id: number;

  @ManyToOne(() => HomeOwnerOrder, (homeorder) => homeorder.home_order_id)
  @JoinColumn({ name: 'home_order_id' })
  home_order_id: HomeOwnerOrder;

  @Column({ type: 'varchar' })
  transaction_id: string;

  @Column({ type: 'varchar' })
  payer_email: string;

  @Column({ type: 'varchar' })
  currency: string;

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'varchar' })
  payment_status: string;

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;
}
