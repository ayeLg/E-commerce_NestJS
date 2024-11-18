import {
  Body,
  Param,
  HttpException,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiController } from 'src/util/decorator/swagger/apiController.decorator';
import { Response } from 'express';
import { errorResponse, successResponse } from 'src/util/helper/response.util';
import { PostApi } from 'src/util/decorator/swagger/postApi.decorator';
import { GetApi } from 'src/util/decorator/swagger/getApi.decorator';
import { PatchApi } from 'src/util/decorator/swagger/patch.decorator';
import { DeleteApi } from 'src/util/decorator/swagger/delete.decorator';

@ApiController('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

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
    summary: 'Create Category',
    body: { type: CreateCategoryDto, description: 'Detail Category ' },
    responses: [
      { status: 200, description: 'Category created successfully' },
      { status: 400, description: 'Bad request' },
    ],
  })
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Res() res: Response,
  ): Promise<Response | void> {
    try {
      const category = await this.categoryService.create(createCategoryDto);

      this.handleResponse(res, !!category, 'Create category', category);
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }

  @GetApi({
    path: '/',
    summary: 'Get all category',
    responses: [
      { status: 200, description: 'Get all category  successfully' },
      { status: 400, description: 'Bad Request' },
    ],
  })
  async findAll(@Res() res: Response): Promise<Response | void> {
    try {
      const category = await this.categoryService.findAll();

      this.handleResponse(res, !!category, 'Get all category', category);
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }

  @GetApi({
    path: '/:id',
    summary: 'Get the category',
    responses: [
      { status: 200, description: 'Get the category successfully' },
      { status: 400, description: 'Bad Request' },
    ],
    param: { name: 'id', description: 'Category Id' },
  })
  async findOne(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response | void> {
    try {
      const category = await this.categoryService.findOne(id);

      this.handleResponse(res, !!category, 'Get the category', category);
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }

  @PatchApi({
    path: '/:id',
    summary: 'Update Category',
    responses: [
      { status: 200, description: 'Update the category successfully' },
      { status: 400, description: 'Bad ' },
    ],
    body: { type: UpdateCategoryDto, description: 'Update Category' },
    param: { name: 'id', description: 'Category ID' },
  })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Res() res: Response,
  ): Promise<Response | void> {
    try {
      const category = await this.categoryService.update(id, updateCategoryDto);

      this.handleResponse(res, !!category, 'Update the category', category);
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }

  @DeleteApi({
    path: '/:id',
    summary: 'Delete Category',
    responses: [
      { status: 200, description: 'Delete the category successfully' },
      { status: 400, description: 'Bad Request' },
    ],
    param: { name: 'id', description: 'Category ID' },
  })
  async remove(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response | void> {
    try {
      const category = await this.categoryService.remove(id);

      this.handleResponse(res, !!category, 'Delete the category', category);
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }
}
