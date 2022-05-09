import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'real_locations' })
export default class RealLocation extends BaseEntity {
    @PrimaryGeneratedColumn()
    location_id: number;

    @Column({ type: 'varchar' })
    location_name: string;

}
