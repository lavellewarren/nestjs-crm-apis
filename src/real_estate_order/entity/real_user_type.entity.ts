import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'real_user_types' })
export default class RealUserType extends BaseEntity {
    @PrimaryGeneratedColumn()
    user_type_id: number;

    @Column({ type: 'varchar' })
    user_type: string;

}
