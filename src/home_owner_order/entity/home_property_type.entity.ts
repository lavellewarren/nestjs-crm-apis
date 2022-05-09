import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn, OneToMany
} from 'typeorm';
import HomeProduct from './home_product.entity';

@Entity({ name: 'home_property_types' })
export default class HomePropertyType extends BaseEntity {
  @PrimaryGeneratedColumn()
  home_property_type_id: number;

  @Column({ type: 'varchar' })
  name: string;

  @OneToMany(() => HomeProduct, (homeProduct) => homeProduct.home_product_id)
  products: HomeProduct[];

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;
}
