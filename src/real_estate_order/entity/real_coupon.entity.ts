import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'real_coupons' })
export default class RealEstateCoupon extends BaseEntity {
    @PrimaryGeneratedColumn()
    coupon_id: number;

    @Column({ type: 'varchar' })
    coupon_code: string;

    @Column({ type: 'varchar' })
    discount_type: string;

    @Column({ type: 'varchar' })
    coupon_amount: string;

    @Column({ type: 'date', nullable: true })
    expiry_date: Date;
}
