import {
  Body,
  Param,
  Req,
  HttpException,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { PostApi } from 'src/util/decorator/swagger/postApi.decorator';
import { Request, Response } from 'express';
import { errorResponse, successResponse } from 'src/util/helper/response.util';
import { GetApi } from 'src/util/decorator/swagger/getApi.decorator';
import { PatchApi } from 'src/util/decorator/swagger/patch.decorator';
import { DeleteApi } from 'src/util/decorator/swagger/delete.decorator';
import { ApiController } from 'src/util/decorator/swagger/apiController.decorator';
import { CreateCartItemDto } from 'src/cart-item/dto/create-cart-item.dto';

// @UseGuards(RoleGuard)
// @Role('ADMIN')
@ApiController('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  private handleResponse(
    res: Response,
    success: boolean,
    message: string,
    data?: any,
  ) {
    if (success) {
      return successResponse(res, `${message} successfully`, data);
    } else {
      return errorResponse(res, `${message} failed`);
    }
  }

  @PostApi({
    path: '/',
    summary: 'Create a new product',
    body: { type: CreateProductDto, description: 'Create product details' },
    responses: [
      { status: 201, description: 'Product Successfully created' },
      { status: 400, description: 'Bad Request' },
    ],
  })
  async create(
    @Body() createProductDto: CreateProductDto,
    @Req() req: Request,
    @Res()
    res: Response,
  ) {
    try {
      const product = await this.productService.create(createProductDto);

      this.handleResponse(res, !!product, 'Product created', product);
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }

  @GetApi({
    path: '/',
    summary: 'Get all products',
    responses: [
      { status: 200, description: 'Get all product successfully' },
      { status: 400, description: 'Bad Request' },
    ],
  })
  async findAll(@Req() req: Request, @Res() res: Response) {
    try {
      const products = await this.productService.findAll();
      if (products) {
        successResponse(res, 'Get all product successfully', products);
      } else {
        errorResponse(res, 'Get all product failed');
      }
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }

  @GetApi({
    path: '/:id',
    summary: 'Get all products',
    responses: [
      { status: 200, description: 'Get all product successfully' },
      { status: 400, description: 'Bad Request' },
    ],
    param: { name: 'id', description: 'Product ID' },
  })
  async findOne(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const products = await this.productService.findOne(id);

      this.handleResponse(res, !!products, 'Get created', products);
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }

  @PatchApi({
    path: '/:id',
    summary: 'Update Product',
    param: { name: 'id', description: 'Product ID' },
    responses: [
      { status: 200, description: 'Update product successfully ' },
      { status: 404, description: 'Bad Request ' },
    ],
    body: { type: UpdateProductDto, description: 'Update product details' },
  })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const product = await this.productService.update(id, updateProductDto);
      this.handleResponse(res, !!product, 'Updated the product', product);
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }

  @DeleteApi({
    path: '/:id',
    summary: 'Delete product',
    responses: [
      { status: 200, description: 'Delete product successfully' },
      { status: 404, description: 'Bad Request ' },
    ],
    param: { name: 'id', description: 'User ID' },
  })
  async remove(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const product = await this.productService.remove(id);

      this.handleResponse(res, !!product, 'Remove the proudct', product);
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }

  @GetApi({
    path: '/:id/user',
    summary: 'Get user who added ',
    responses: [
      { status: 200, description: 'Get user who added product successfully' },
      { status: 400, description: 'Bad Request' },
    ],
    param: { name: 'id', description: 'Product ID' },
  })
  async getUserWhoAdded(
    @Res() res: Response,
    @Param('id') id: string,
  ): Promise<Response | void> {
    try {
      const user = await this.productService.getUserWhoAdded(id);

      this.handleResponse(res, !!user, 'Get the user who added product', user);
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }

  @GetApi({
    path: '/:id/users',
    summary: 'Get users who reviewd the product',
    responses: [
      {
        status: 200,
        description: 'Get users who reviewed product successfully',
      },
      { status: 400, description: 'Bad Request' },
    ],
    param: { name: 'id', description: 'Product ID' },
  })
  async getUserWhoReivew(
    @Res() res: Response,
    @Param('id') id: string,
  ): Promise<Response | void> {
    try {
      const user = await this.productService.getUserWhoReviewed(id);
      this.handleResponse(
        res,
        !!user,
        'Get the users who reviewed product',
        user,
      );
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }

  @GetApi({
    path: '/:id/reviews',
    summary: 'Get the reviews ',
    responses: [
      { status: 200, description: 'Get the reviews successfully' },
      { status: 400, description: 'Bad request' },
    ],
    param: { name: 'id', description: 'Product ID' },
  })
  async getReview(
    @Res() res: Response,
    @Param('id') id: string,
  ): Promise<Response | void> {
    try {
      const reviews = await this.productService.getReview(id);
      if (reviews) {
        successResponse(res, 'Get the reviews successfully', reviews);
      } else {
        errorResponse(res, 'Get the reviews failed');
      }
      this.handleResponse(res, !!reviews, 'Get the reviews', reviews);
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }

  async addToCart(@Res() res: Response, createCartItemDto: CreateCartItemDto) {
    try {
      const cartItem = await this.productService.addToCart(createCartItemDto);

      this.handleResponse(res, !!cartItem, 'Add item to cart', cartItem);
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }
}
