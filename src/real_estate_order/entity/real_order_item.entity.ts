import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import RealCoverage from './real_coverage.entity';
import RealEstateOrder from './real_order.entity';
import RealProduct from './real_product.entity';

@Entity({ name: 'real_order_items' })
export default class RealOrderItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    real_order_item_id: number;

    @ManyToOne(() => RealEstateOrder, (order) => order.order_id)
    @JoinColumn({ name: 'order_id' })
    order: string;

    @ManyToOne(() => RealProduct, (product) => product.product_id)
    @JoinColumn({ name: 'product_id' })
    product: string;

    @Column({ type: 'varchar' })
    product_name: string;

    @Column({ type: 'varchar' })
    product_type: string;

    @Column({ type: 'varchar' })
    quantity: Number;

    @Column({ type: 'float' })
    rate: Number;

    @Column({ type: 'float' })
    line_total: Number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
