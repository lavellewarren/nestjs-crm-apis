import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from 'typeorm';
import { TransactionStatus } from '../../global/type';
import HomeAppliedCoupon from './home_applied_coupon.entity';
import HomeOrderItem from './home_order_item.entity';
import HomeCardPayment from './home_card_payment.entity';

@Entity({ name: 'home_owner_orders' })
export default class HomeOwnerOrder extends BaseEntity {
    @PrimaryGeneratedColumn()
    home_order_id: number;

    @Column({ type: 'varchar' })
    firstname: string;

    @Column({ type: 'varchar' })
    lastname: string;

    @Column({ type: 'varchar', nullable: true })
    company: string;

    @Column({ type: 'varchar', nullable: true })
    country: string;

    @Column({ type: 'varchar', nullable: true })
    street1: string;

    @Column({ type: 'varchar', nullable: true })
    street2: string;

    @Column({ type: 'varchar', nullable: true })
    city: string;

    @Column({ type: 'varchar', nullable: true })
    state: string;

    @Column({ type: 'varchar', nullable: true })
    pincode: string;

    @Column({ type: 'varchar', nullable: true })
    phone: string;

    @Column({ type: 'varchar' })
    email: string;

    @Column({ type: 'varchar', nullable: true })
    prop_street1: string;

    @Column({ type: 'varchar', nullable: true })
    prop_street2: string;

    @Column({ type: 'varchar', nullable: true })
    prop_city: string;

    @Column({ type: 'varchar', nullable: true })
    prop_state: string;

    @Column({ type: 'varchar', nullable: true })
    prop_zipcode: string;

    @Column({ type: 'varchar', nullable: true })
    order_notes: string;

    @Column({ type: 'varchar', nullable: true })
    credit_balance: string;

    @Column({ type: 'varchar', nullable: true })
    coupon_code: string;

    @Column({ type: 'varchar', nullable: true })
    subtotal: string;

    @Column({ type: 'varchar', nullable: true })
    total: string;

    @Column({ type: 'varchar', nullable: true })
    pay_method: string;

    @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
    status: TransactionStatus;

    @Column({ type: 'date', nullable: true })
    transaction_date: Date;

    @OneToMany(() => HomeAppliedCoupon, (homeAppliedCoupon) => homeAppliedCoupon.home_order_id)
    applied_coupons: HomeAppliedCoupon[];

    @OneToMany(() => HomeOrderItem, (homeOrderItem) => homeOrderItem.home_order_id)
    order_items: HomeOrderItem[];

    @OneToMany(() => HomeCardPayment, (homeCardPayment) => homeCardPayment.home_order_id)
    cardPayments: HomeCardPayment[];

    @OneToMany(() => HomeAppliedCoupon, (homeAppliedCoupon) => homeAppliedCoupon.home_order_id)
    homeAppliedCoupons: HomeAppliedCoupon[];

    @CreateDateColumn({ select: false })
    created_at: Date;

    @UpdateDateColumn({ select: false })
    updated_at: Date;
}
