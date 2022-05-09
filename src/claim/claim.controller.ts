import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ClaimService } from './claim.service';
import { CreateClaimDto } from './dto/create-claim.dto';

@Controller('claims')
export class ClaimController {
  constructor(private readonly claimService: ClaimService) {}

  @Post()
  public async create(@Body() claim: CreateClaimDto) {
    return this.claimService.create(claim);
  }

  @Get()
  public async findByFilter(@Query('status') status) {
    return this.claimService.getClaimByStatus(status);
  }
}
