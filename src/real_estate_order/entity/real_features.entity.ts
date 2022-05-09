import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import RealFeatureTitle from './real_feature_title.entity';
import RealLocation from './real_location.entity';

@Entity({ name: 'real_features' })
export default class RealFeature extends BaseEntity {
    @PrimaryGeneratedColumn()
    feature_id: number;

    @ManyToOne(() => RealFeatureTitle, (t) => t.feature_title_id)
    @JoinColumn({ name: 'feature_title_id' })
    feature_title: string;

    @Column({ type: 'varchar' })
    feature_name: string;

}
