import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import RealLocation from './real_location.entity';
import RealProduct from './real_product.entity';
import RealProductFeature from './real_product_feature.entity';

@Entity({ name: 'real_product_feature_relationships' })
export default class RealProductFeatureRelationship extends BaseEntity {
    @PrimaryGeneratedColumn()
    product_feature_relationship_id: number;

    @ManyToOne(() => RealProductFeature, (f) => f.product_feature_id)
    @JoinColumn({ name: 'product_feature_id' })
    product_feature: string;

    @ManyToOne(() => RealProduct, (p) => p.product_id)
    @JoinColumn({ name: 'product_id' })
    product: string;


}
