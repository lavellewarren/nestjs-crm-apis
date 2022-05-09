import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ContractStatus } from './type/contract-status.enum';

@Entity({ name: 'contracts' })
export class Contract {
  @PrimaryGeneratedColumn('uuid', { name: 'contract_id' })
  public contract_id: number;

  @Column({ name: 'company_name' })
  public company_name: string;

  @Column({ name: 'contract_name' })
  public contract_name: string;

  @Column({ name: 'contract_number' })
  public contract_number: string;

  @Column({ name: 'contract_email' })
  public contract_email: string;

  /**
   * @description comma seperated services;
   * @example 'appliance,hvac,plumbing'
   */
  @Column({ name: 'trade_services' })
  public trade_services: string; //

  /**
   * @description comma seperated service areas;
   * @example 'utah, nevada, texas'
   */
  @Column({ name: 'service_areas' })
  public service_areas: string;

  @Column({ name: 'hourly_rate', type: 'float' })
  public hourly_rate: number;

  @Column({ name: 'status', nullable: true })
  public status: ContractStatus;
}
