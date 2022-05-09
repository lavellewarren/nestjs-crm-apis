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
import HomeProduct from './home_product.entity';

@Entity({ name: 'home_order_items' })
export default class HomeOrderItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  home_order_item_id: number;

  @ManyToOne(() => HomeOwnerOrder, (homeorder) => homeorder.home_order_id)
  @JoinColumn({ name: 'home_order_id' })
  home_order_id: string;

  @ManyToOne(() => HomeProduct, (homeProduct) => homeProduct.home_product_id)
  @JoinColumn({ name: 'product_id' })
  product_id: string;

  @Column({ type: 'varchar' })
  product_type: string;

  @Column({ type: 'varchar' })
  payinterval_type: string;

  @Column({ type: 'varchar' })
  quantity: string;

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;
}
