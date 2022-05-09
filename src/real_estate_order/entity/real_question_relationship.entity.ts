import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import RealCoverage from './real_coverage.entity';
import RealCoverageType from './real_coverage_type.entity';
import RealLocation from './real_location.entity';
import RealEstateOrder from './real_order.entity';
import RealProduct from './real_product.entity';
import RealPropertyType from './real_property_type.entity';
import RealQuestion from './real_question.entity';

@Entity({ name: 'real_question_relationships' })
export default class RealQuestionRelationship extends BaseEntity {
    @PrimaryGeneratedColumn()
    real_question_relationship_id: number;

    @ManyToOne(() => RealLocation, (l) => l.location_id)
    @JoinColumn({ name: 'location_id' })
    location: string;

    @ManyToOne(() => RealCoverageType, (co) => co.coverage_type_id)
    @JoinColumn({ name: 'coverage_type_id' })
    coverage_type: string;

    @ManyToOne(() => RealPropertyType, (r) => r.property_id)
    @JoinColumn({ name: 'property_type_id' })
    property_type: string;

    @ManyToOne(() => RealQuestion, (q) => q.question_id)
    @JoinColumn({ name: 'question_id' })
    question: string;

    @Column({ type: 'varchar' })
    question_value: string;

    @Column({ type: 'varchar' })
    products: string;

}
