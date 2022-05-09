import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './review.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,
  ) {}

  public async create(review: CreateReviewDto) {
    const newReview = this.reviewRepo.create({
      name: review.name,
      review: review.review,
      rate: review.rate,
      avatar: review.avatar,
    });

    return this.reviewRepo.save(newReview);
  }

  public async getAll() {
    return this.reviewRepo.find();
  }
}
