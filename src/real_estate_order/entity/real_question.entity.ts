import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'real_questions' })
export default class RealQuestion extends BaseEntity {
    @PrimaryGeneratedColumn()
    question_id: number;

    @Column({ type: 'varchar' })
    question_name: string;

}
