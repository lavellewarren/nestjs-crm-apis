import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TransactionStatus } from './type/transaction-status.enum';

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn('uuid', { name: 'transaction_id' })
  public transaction_id: string;

  @Column({ name: 'authorize_transaction_id', nullable: true })
  public authorize_transaction_id?: string;

  @Column({ name: 'invoice_number' })
  public invoice_number: string;

  @Column({ name: 'product_name' })
  public product_name: string;

  @Column({ name: 'coupon', nullable: true })
  public coupon: string;

  @Column({ name: 'original_amount', type: 'float' })
  public original_amount: number;

  @Column({ name: 'paid_amount', nullable: true, type: 'float' })
  public paid_amount: number;

  @Column({ name: 'status', nullable: true })
  public status: TransactionStatus;

  @CreateDateColumn()
  public created_at: Date;
}
