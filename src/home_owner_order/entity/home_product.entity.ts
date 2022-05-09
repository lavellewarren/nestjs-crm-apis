import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import HomePropertyType from './home_property_type.entity';
import HomeProductLocation from './home_product_location.entity';
import HomeOrderItem from './home_order_item.entity';

@Entity({ name: 'home_products' })
export default class HomeProduct extends BaseEntity {
  @PrimaryGeneratedColumn()
  home_product_id: number;

  @ManyToOne(() => HomeProductLocation, (homeProductLocation) => homeProductLocation.home_product_location_id)
  @JoinColumn({ name: 'home_product_location_id' })
  home_product_location_id: HomeProductLocation;

  @ManyToOne(() => HomePropertyType, (homePropertyType) => homePropertyType.home_property_type_id)
  @JoinColumn({ name: 'home_property_type_id' })
  home_property_type_id: HomePropertyType;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  monthly_price: string;

  @Column({ type: 'varchar' })
  yearly_price: string;

  @Column({ type: 'text' })
  unique_features: string;

  @OneToMany(() => HomeOrderItem, (homeOrderItem) => homeOrderItem.product_id)
  order_items: HomeOrderItem[];

  @CreateDateColumn({ select: false, })
  created_at: Date;

  @UpdateDateColumn({ select: false, })
  updated_at: Date;
}
