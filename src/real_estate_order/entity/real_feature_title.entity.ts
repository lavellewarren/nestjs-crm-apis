import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import RealFeature from './real_features.entity';
import RealLocation from './real_location.entity';

@Entity({ name: 'real_feature_titles' })
export default class RealFeatureTitle extends BaseEntity {
    @PrimaryGeneratedColumn()
    feature_title_id: number;

    @ManyToOne(() => RealLocation, (l) => l.location_id)
    @JoinColumn({ name: 'location_id' })
    location: string;

    @Column({ type: 'varchar' })
    title: string;

    @OneToMany(() => RealFeature, (f) => f.feature_title)
    features: RealFeature[];
}
