import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn, ManyToOne, JoinColumn
} from 'typeorm';
import HomeStandardTitle from './home_standard_title.entity';

@Entity({ name: 'home_standard_features' })
export default class HomeStandardFeature extends BaseEntity {
  @PrimaryGeneratedColumn()
  home_standard_feature_id: number;

  @ManyToOne(() => HomeStandardTitle, (homeStandardTitle) => homeStandardTitle.home_standard_title_id)
  @JoinColumn({ name: 'home_standard_title_id' })
  home_standard_title_id: string;

  @Column({ type: 'varchar' })
  standard_feature: string;
}
