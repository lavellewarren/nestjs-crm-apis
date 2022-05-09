import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ContractService } from './contract.service';
import { CreateContractDto } from './dto/create-contract.dto';

@Controller('contracts')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post()
  public async create(@Body() contract: CreateContractDto) {
    return this.contractService.create(contract);
  }

  @Get()
  public async findByFilter(@Query('status') status) {
    return this.contractService.getContractsByStatus(status);
  }
}
