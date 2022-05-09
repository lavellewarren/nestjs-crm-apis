import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ClaimStatus } from './type/claim-status.dto';

@Entity({ name: 'claims' })
export class Claim {
  @PrimaryGeneratedColumn('uuid', { name: 'claim_id' })
  public claimId: number;

  @Column()
  public name: string;

  @Column({ name: 'phone_number' })
  public phone_number: string;

  @Column()
  public email: string;

  @Column({ name: 'street_address' })
  public street_address: string;

  @Column()
  public city: string;

  @Column()
  public state: string;

  @Column({ name: 'zip_code' })
  public zip_code: string;

  @Column()
  public description: string;

  @Column({ name: 'is_emergency' })
  public is_emergency: boolean;

  @Column({ name: 'contact_methods' })
  public contact_methods: string;

  @Column({ name: 'technicians' })
  public technicians: string;

  @Column()
  public status: ClaimStatus;
}
