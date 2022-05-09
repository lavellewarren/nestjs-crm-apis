import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Claim } from './claim.entity';
import { CreateClaimDto } from './dto/create-claim.dto';
import { ClaimStatus } from './type/claim-status.dto';

@Injectable()
export class ClaimService {
  constructor(
    @InjectRepository(Claim)
    private claimRepo: Repository<Claim>,
  ) {}

  public async create(createClaimDto: CreateClaimDto): Promise<Claim> {
    const newClaim = this.claimRepo.create({
      ...createClaimDto,
      status: ClaimStatus.RECEIVED,
    });

    return this.claimRepo.save(newClaim);
  }

  public async getClaimByStatus(status): Promise<Claim[]> {
    return this.claimRepo.find({
      where: {
        status,
      },
    });
  }
}
