import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'real_property_types' })
export default class RealPropertyType extends BaseEntity {
    @PrimaryGeneratedColumn()
    property_id: number;

    @Column({ type: 'varchar' })
    property_name: string;

    @Column({ type: 'varchar' })
    question_name: string;

}
