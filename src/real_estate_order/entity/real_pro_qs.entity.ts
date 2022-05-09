import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import RealCoverage from './real_coverage.entity';
import RealCoverageType from './real_coverage_type.entity';
import RealLocation from './real_location.entity';
import RealEstateOrder from './real_order.entity';
import RealProduct from './real_product.entity';
import RealPropertyType from './real_property_type.entity';
import RealQuestion from './real_question.entity';

@Entity({ name: 'real_property_type_question' })
export default class RealProQs extends BaseEntity {
    @PrimaryGeneratedColumn()
    real_pro_id: number;

    @ManyToOne(() => RealPropertyType, (r) => r.property_id)
    @JoinColumn({ name: 'property_type_id' })
    property_type: string;

    @Column({ type: 'varchar' })
    question: string;

    @Column({ type: 'varchar' })
    input_name: string;

    @Column({ type: 'varchar' })
    input_type: string;

    @Column({ type: 'varchar' })
    valid_options: string;

    @Column({ type: 'varchar' })
    default_value: string;

}
