import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import RealCoverage from './real_coverage.entity';
import RealCoverageType from './real_coverage_type.entity';
import RealLocation from './real_location.entity';
import RealEstateOrder from './real_order.entity';
import RealProduct from './real_product.entity';
import RealPropertyType from './real_property_type.entity';
import RealProQs from './real_pro_qs.entity';
import RealQuestion from './real_question.entity';

@Entity({ name: 'real_propertype_question_relationships' })
export default class RealProQsRelationship extends BaseEntity {
    @PrimaryGeneratedColumn()
    real_pro_qs_id: number;

    @ManyToOne(() => RealLocation, (l) => l.location_id)
    @JoinColumn({ name: 'location_id' })
    location: string;

    @ManyToOne(() => RealCoverageType, (co) => co.coverage_type_id)
    @JoinColumn({ name: 'coverage_type_id' })
    coverage_type: string;


    @ManyToOne(() => RealPropertyType, (r) => r.property_id)
    @JoinColumn({ name: 'property_type_id' })
    property_type: string;

    @ManyToOne(() => RealProQs, (r) => r.real_pro_id)
    @JoinColumn({ name: 'question_id' })
    question: string;

}
