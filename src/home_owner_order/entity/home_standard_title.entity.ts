import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn
} from 'typeorm';
import HomeProductLocation from './home_product_location.entity';
import HomeStandardFeature from './home_standard_features.entity';

@Entity({ name: 'home_standard_titles' })
export default class HomeStandardTitle extends BaseEntity {
  @PrimaryGeneratedColumn()
  home_standard_title_id: number;

  @ManyToOne(() => HomeProductLocation, (homeProductLocation) => homeProductLocation.home_product_location_id)
  @JoinColumn({ name: 'home_product_location_id' })
  home_product_location: string;

  @Column({ type: 'varchar' })
  standard_title: string;

  @OneToMany(() => HomeStandardFeature, (homeStandardFeature) => homeStandardFeature.home_standard_title_id)
  homeStandardFeatures: HomeStandardFeature[];

}
