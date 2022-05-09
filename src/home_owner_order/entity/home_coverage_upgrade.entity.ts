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
import HomeProduct from './home_product.entity';

@Entity({ name: 'home_coverage_upgrades' })
export default class HomeCoverageUpgrade extends BaseEntity {
  @PrimaryGeneratedColumn()
  home_coverage_upgrade_id: number;

  @ManyToOne(() => HomeProduct, (product) => product.home_product_id)
  @JoinColumn({ name: 'home_product_id' })
  home_product_id: HomeProduct;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  monthly_price: string;

  @Column({ type: 'varchar' })
  yearly_price: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text' })
  url: string;

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;
}
