import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'reviews' })
export class Review {
  @PrimaryGeneratedColumn('uuid', { name: 'review_id' })
  public reviewId: string;

  @Column()
  public name: string;

  @Column()
  public review: string;

  @Column()
  public rate: number;

  @Column()
  public avatar: string;

  @CreateDateColumn()
  public created_at: Date;
}
