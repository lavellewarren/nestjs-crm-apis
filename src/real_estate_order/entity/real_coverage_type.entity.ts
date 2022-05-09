import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'real_coverage_types' })
export default class RealCoverageType extends BaseEntity {
    @PrimaryGeneratedColumn()
    coverage_type_id: number;

    @Column({ type: 'varchar' })
    type_name: string;

}
