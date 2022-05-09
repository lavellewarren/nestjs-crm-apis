import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import RealCoverage from './real_coverage.entity';
import RealCoverageType from './real_coverage_type.entity';
import RealLocation from './real_location.entity';
import RealEstateOrder from './real_order.entity';
import RealProduct from './real_product.entity';
import RealPropertyType from './real_property_type.entity';
import RealQuestion from './real_question.entity';

@Entity({ name: 'real_relationships' })
export default class RealRelationship extends BaseEntity {
    @PrimaryGeneratedColumn()
    real_relationship_id: number;

    @ManyToOne(() => RealLocation, (l) => l.location_id)
    @JoinColumn({ name: 'location_id' })
    location: string;

    @ManyToOne(() => RealCoverageType, (co) => co.coverage_type_id)
    @JoinColumn({ name: 'coverage_type_id' })
    coverage_type: string;

    @ManyToOne(() => RealPropertyType, (q) => q.property_id)
    @JoinColumn({ name: 'question_type_id' })
    question_type: string;

    @Column({ type: 'varchar' })
    product_ids: string;

}
