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

@Entity({ name: 'home_applied_coupons' })
export default class HomeAppliedCoupon extends BaseEntity {
  @PrimaryGeneratedColumn()
  home_applied_coupon_id: number;

  @ManyToOne(() => HomeOwnerOrder, (homeorder) => homeorder.home_order_id)
  @JoinColumn({ name: 'home_order_id' })
  home_order_id: string;

  @Column({ type: 'varchar' })
  coupon_code: string;

  @Column({ type: 'float' })
  discount: string;

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;
}
