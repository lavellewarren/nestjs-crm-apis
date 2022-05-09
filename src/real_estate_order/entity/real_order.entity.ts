import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany, ManyToOne, JoinColumn
} from 'typeorm';
import { TransactionStatus } from '../../global/type';
import RealAppliedCoupon from './real_applied_coupon.entity';
import RealCoverageType from './real_coverage_type.entity';
import RealLocation from './real_location.entity';
import RealOrderItem from './real_order_item.entity';
import RealPropertyType from './real_property_type.entity';

@Entity({ name: 'real_orders' })
export default class RealEstateOrder extends BaseEntity {
    @PrimaryGeneratedColumn()
    order_id: number;

    @ManyToOne(() => RealLocation, (locatoin) => locatoin.location_id)
    @JoinColumn({ name: 'property_location_id' })
    property_location: string;

    @ManyToOne(() => RealPropertyType, (type) => type.property_id)
    @JoinColumn({ name: 'property_type_id' })
    property_type: string;

    @ManyToOne(() => RealCoverageType, (type) => type.coverage_type_id)
    @JoinColumn({ name: 'property_coverage_type_id' })
    property_coverage_type: string;

    @Column({ type: 'text', nullable: true })
    i_am_the: string;

    @Column({ type: 'varchar', nullable: true })
    real_estate_role: string;

    @Column({ type: 'varchar', nullable: false })
    prop_street1: string;

    @Column({ type: 'varchar', nullable: true })
    prop_street2: string;

    @Column({ type: 'varchar', nullable: false })
    prop_city: string;

    @Column({ type: 'varchar', nullable: false })
    prop_state: string;

    @Column({ type: 'varchar', nullable: false })
    prop_zipcode: string;

    @Column({ type: 'varchar', nullable: true })
    buyer_name: string;

    @Column({ type: 'varchar', nullable: true })
    buyer_phone: string;

    @Column({ type: 'varchar', nullable: true })
    buyer_email: string;

    @Column({ type: 'varchar', nullable: true })
    buyer_agentname: string;

    @Column({ type: 'varchar', nullable: true })
    buyer_agentphone: string;

    @Column({ type: 'varchar', nullable: true })
    buyer_agentemail: string;

    @Column({ type: 'varchar', nullable: true })
    buyer_realstate_company: string;

    @Column({ type: 'varchar', nullable: true })
    buyer_coordinatorname: string;

    @Column({ type: 'varchar', nullable: true })
    buyer_coordinatorphone: string;

    @Column({ type: 'varchar', nullable: true })
    buyer_coordinatoremail: string;

    @Column({ type: 'varchar', nullable: true })
    seller_name: string;

    @Column({ type: 'varchar', nullable: true })
    seller_phone: string;

    @Column({ type: 'varchar', nullable: true })
    seller_email: string;

    @Column({ type: 'varchar', nullable: true })
    seller_agentname: string;

    @Column({ type: 'varchar', nullable: true })
    seller_agentphone: string;

    @Column({ type: 'varchar', nullable: true })
    seller_agentemail: string;

    @Column({ type: 'varchar', nullable: true })
    seller_realstate_company: string;

    @Column({ type: 'varchar', nullable: true })
    seller_coordinatorname: string;

    @Column({ type: 'varchar', nullable: true })
    seller_coordinatorphone: string;

    @Column({ type: 'varchar', nullable: true })
    seller_coordinatoremail: string;

    @Column({ type: 'varchar', nullable: true })
    escrow_title: string;

    @Column({ type: 'varchar', nullable: true })
    escrow_street1: string;

    @Column({ type: 'varchar', nullable: true })
    escrow_street2: string;

    @Column({ type: 'varchar', nullable: true })
    escrow_city: string;

    @Column({ type: 'varchar', nullable: true })
    escrow_state: string;

    @Column({ type: 'varchar', nullable: true })
    escrow_zipcode: string;

    @Column({ type: 'varchar', nullable: true })
    escrow_assistantname: string;

    @Column({ type: 'varchar', nullable: true })
    escrow_assistantemail: string;

    @Column({ type: 'varchar', nullable: true })
    closing_officername: string;

    @Column({ type: 'varchar', nullable: true })
    closing_officeremail: string;

    @Column({ type: 'varchar', nullable: true })
    closing_officerphone: string;

    @Column({ type: 'varchar', nullable: true })
    closing_date: string;

    @Column({ type: 'varchar', nullable: true })
    order_biller: string;

    @Column({ type: 'text', nullable: true })
    order_notes: string;

    @Column({ type: 'varchar', nullable: true })
    sales_person: string;

    @Column({ type: 'varchar', nullable: true })
    coupon_code: string;

    @Column({ type: 'float', nullable: true })
    total_amount: number;

    @Column({ type: 'float', nullable: false })
    net_amount: number;

    @Column({ type: 'float', nullable: true })
    credit_balance: number;

    @Column({ type: 'enum', enum: TransactionStatus, nullable: true })
    order_status: TransactionStatus;

    @Column({ type: 'date', nullable: true })
    transaction_date: Date;

    @OneToMany(() => RealAppliedCoupon, (applyCoupon) => applyCoupon.order_id)
    applyCoupons: RealAppliedCoupon[];

    @OneToMany(() => RealOrderItem, (item) => item.order)
    orderItems: RealOrderItem[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
