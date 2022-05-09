import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'real_coverages' })
export default class RealCoverage extends BaseEntity {
    @PrimaryGeneratedColumn()
    coverage_id: number;

    @Column({ type: 'varchar' })
    product_id: string;

    @Column({ type: 'varchar' })
    coverage_type: string;

    @Column({ type: 'varchar' })
    coverage_name: string;

    @Column({ type: 'varchar' })
    coverage_price: string;

    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'text' })
    info: string;

    @Column({ type: 'text' })
    url: string;

}
