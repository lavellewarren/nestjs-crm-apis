import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import RealLocation from './real_location.entity';

@Entity({ name: 'real_product_features' })
export default class RealProductFeature extends BaseEntity {
    @PrimaryGeneratedColumn()
    product_feature_id: number;

    @ManyToOne(() => RealLocation, (l) => l.location_id)
    @JoinColumn({ name: 'location_id' })
    location: string;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'text' })
    content: string;

}
