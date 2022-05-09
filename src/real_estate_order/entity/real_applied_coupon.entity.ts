import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import RealEstateOrder from './real_order.entity';

@Entity({ name: 'real_applied_coupons' })
export default class RealAppliedCoupon extends BaseEntity {
    @PrimaryGeneratedColumn()
    real_estate_applied_coupon_id: number;

    @ManyToOne(() => RealEstateOrder, (order) => order.order_id)
    @JoinColumn({ name: 'order_id' })
    order_id: string;

    @Column({ type: 'varchar' })
    coupon_code: string;

    @Column({ type: 'float' })
    discount: string;

    @CreateDateColumn({ select: false })
    created_at: Date;

    @UpdateDateColumn({ select: false })
    updated_at: Date;
}
