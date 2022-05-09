import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from './contract.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { ContractStatus } from './type/contract-status.enum';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract)
    private contractRepo: Repository<Contract>,
  ) {}

  public async create(createContractDto: CreateContractDto): Promise<Contract> {
    const existContract = await this.contractRepo.findOne({
      where: {
        company_name: createContractDto.company_name,
      },
    });

    if (existContract) {
      throw new HttpException(
        'Contract with the same company name exists',
        HttpStatus.CONFLICT,
      );
    }

    const newContract = this.contractRepo.create({
      ...createContractDto,
      status: ContractStatus.RECEIVE,
    });

    return this.contractRepo.save(newContract);
  }

  public async getContractsByStatus(status): Promise<Contract[]> {
    return this.contractRepo.find({
      where: {
        status: status,
      },
    });
  }
}
