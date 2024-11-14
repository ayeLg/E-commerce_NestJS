import {
  Body,
  Param,
  HttpException,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { errorResponse, successResponse } from 'src/util/helper/response.util';
import { Response } from 'express';
import { PostApi } from 'src/util/decorator/swagger/postApi.decorator';
import { GetApi } from 'src/util/decorator/swagger/getApi.decorator';
import { PatchApi } from 'src/util/decorator/swagger/patch.decorator';
import { DeleteApi } from 'src/util/decorator/swagger/delete.decorator';
import { ApiController } from 'src/util/decorator/swagger/apiController.decorator';

@ApiController('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @PostApi({
    path: '/',
    summary: 'Create Review',
    responses: [
      { status: 200, description: 'Create review successfully' },
      { status: 400, description: 'Bad Request' },
    ],
    body: { type: CreateReviewDto, description: 'Detail review' },
  })
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @Res() res: Response,
  ): Promise<Response | void> {
    try {
      const review = await this.reviewService.create(createReviewDto);
      if (review) {
        successResponse(res, 'Create review successfully', review);
      }
      errorResponse(res, 'Create review failed');
    } catch (error) {
      if (!(error as HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }

  @GetApi({
    path: '/',
    summary: 'Get all reivew ',
    responses: [
      { status: 200, description: 'Get all review successfully' },
      { status: 400, description: 'Bad Request' },
    ],
  })
  async findAll(@Res() res: Response): Promise<Response | void> {
    try {
      const review = await this.reviewService.findAll();
      if (review) {
        successResponse(res, 'Get all review successfully', review);
      }
      errorResponse(res, 'Get all review failed');
    } catch (error) {
      if (!(error as HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }

  @GetApi({
    path: '/:id',
    summary: 'Get the reivew ',
    responses: [
      { status: 200, description: 'Get the review successfully' },
      { status: 400, description: 'Bad Request' },
    ],
    param: { name: 'id', description: 'Review ID' },
  })
  async findOne(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response | void> {
    try {
      const review = await this.reviewService.findOne(id);
      if (review) {
        successResponse(res, 'Get the review successfully', review);
      }
      errorResponse(res, 'Get the review failed');
    } catch (error) {
      if (!(error as HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }

  @PatchApi({
    path: '/:id',
    summary: 'Update Review',
    responses: [
      { status: 200, description: 'Update the review successfully' },
      { status: 400, description: 'Bad Request' },
    ],
    body: { type: UpdateReviewDto, description: 'Review Detail' },
    param: { name: 'id', description: 'Review ID' },
  })
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Res() res: Response,
  ): Promise<Response | void> {
    try {
      const review = await this.reviewService.update(id, updateReviewDto);
      if (review) {
        successResponse(res, 'Update the review successfully', review);
      }
      errorResponse(res, 'Update the review failed');
    } catch (error) {
      if (!(error as HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }

  @DeleteApi({
    path: '/:id',
    summary: 'Delete review',
    responses: [
      { status: 200, description: 'Delete review successfully' },
      { status: 400, description: 'Bad Request ' },
    ],
    param: { name: 'id', description: 'Delete review' },
  })
  async remove(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response | void> {
    try {
      const review = await this.reviewService.remove(id);
      if (review) {
        successResponse(res, 'Delete review successfully', review);
      }
      errorResponse(res, 'Delete review failed');
    } catch (error) {
      if (!(error as HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }
}
