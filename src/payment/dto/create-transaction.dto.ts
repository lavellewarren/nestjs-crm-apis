import { IsCurrency, IsOptional, IsString } from 'class-validator';
import { TransactionStatus } from '../type/transaction-status.enum';

export class CreateTransactionDto {
  @IsString()
  @IsOptional()
  public authorize_transaction_id?: string;

  @IsString()
  public invoice_number: string;

  @IsString()
  public product_name: string;

  @IsString()
  public coupon: string;

  @IsCurrency()
  public original_amount: number;

  @IsOptional()
  @IsCurrency()
  public paid_amount?: number;

  @IsOptional()
  @IsString()
  public status: TransactionStatus;
}
