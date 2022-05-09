import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'real_products' })
export default class RealProduct extends BaseEntity {
    @PrimaryGeneratedColumn()
    product_id: number;

    @Column({ type: 'varchar' })
    product_name: string;

    @Column({ type: 'text', nullable: true })
    short_desc: string;

    @Column({ type: 'varchar' })
    price: string;

    @CreateDateColumn({ select: false })
    created_at: Date;

    @UpdateDateColumn({ select: false })
    updated_at: Date;
}
