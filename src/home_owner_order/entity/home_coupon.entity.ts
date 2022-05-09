import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'home_coupons' })
export default class HomeCoupon extends BaseEntity {
  @PrimaryGeneratedColumn()
  home_coupon_id: number;

  @Column({ type: 'varchar' })
  coupon_code: string;

  @Column({ type: 'varchar' })
  discount_type: string;

  @Column({ type: 'varchar' })
  coupon_amount: string;

  @Column({ type: 'varchar' })
  expiry_date: string;

}
