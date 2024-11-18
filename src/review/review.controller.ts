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
  private handleResponse(
    res: Response,
    success: boolean,
    message: string,
    data?: any,
  ) {
    if (success) {
      return successResponse(res, message, data);
    } else {
      return errorResponse(res, message);
    }
  }
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

      this.handleResponse(res, !!review, 'Create reiview', review);
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

      this.handleResponse(res, !!review, 'Get all reiviews', review);
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

      this.handleResponse(res, !!review, 'Get the reiview', review);
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

      this.handleResponse(res, !!review, 'Update the reiview', review);
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

      this.handleResponse(res, !!review, 'Delete the reiview', review);
    } catch (error) {
      if (!(error as HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }
}
