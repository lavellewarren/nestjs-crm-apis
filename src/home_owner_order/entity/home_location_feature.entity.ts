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
import HomeProductLocation from './home_product_location.entity';

@Entity({ name: 'home_location_features' })
export default class HomeLocationFeature extends BaseEntity {
  @PrimaryGeneratedColumn()
  home_location_feature_id: number;

  @ManyToOne(() => HomeProductLocation, (homeProductLocation) => homeProductLocation.home_product_location_id)
  @JoinColumn({ name: 'home_product_location_id' })
  home_product_location_id: HomeProductLocation;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;
}
