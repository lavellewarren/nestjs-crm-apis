import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn, OneToMany
} from 'typeorm';
import HomeProduct from './home_product.entity';
import HomeLocationFeature from './home_location_feature.entity';

@Entity({ name: 'home_product_locations' })
export default class HomeProductLocation extends BaseEntity {
  @PrimaryGeneratedColumn()
  home_product_location_id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  slug: string;

  @Column({ type: 'varchar' })
  image: string;

  @OneToMany(() => HomeProduct, (homeProduct) => homeProduct.home_product_id)
  products: HomeProduct[];

  @OneToMany(() => HomeLocationFeature, (homeLocationFeature) => homeLocationFeature.home_product_location_id)
  locationFeatures: HomeLocationFeature[];

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;
}
