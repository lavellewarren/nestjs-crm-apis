import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  public async create(@Body() review: CreateReviewDto) {
    return this.reviewService.create(review);
  }

  @Get()
  public async getAllReviews() {
    return this.reviewService.getAll();
  }
}
