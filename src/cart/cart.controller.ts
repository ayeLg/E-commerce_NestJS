import {
  Body,
  Param,
  HttpException,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { errorResponse, successResponse } from 'src/util/helper/response.util';
import { Response } from 'express';
import { PostApi } from 'src/util/decorator/swagger/postApi.decorator';
import { GetApi } from 'src/util/decorator/swagger/getApi.decorator';
import { DeleteApi } from 'src/util/decorator/swagger/delete.decorator';
import { ApiController } from 'src/util/decorator/swagger/apiController.decorator';

@ApiController('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

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
    summary: 'Create cart',
    responses: [
      { status: 200, description: 'Cart created successfully' },
      { status: 400, description: 'Bad Request' },
    ],
    body: { type: CreateCartDto, description: 'cart details' },
  })
  async create(
    @Body() createCartDto: CreateCartDto,
    @Res() res: Response,
  ): Promise<Response | void> {
    try {
      const cart = await this.cartService.create(createCartDto);

      this.handleResponse(res, !!cart, 'Create cart', cart);
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }

  @GetApi({
    path: '/',
    summary: 'Get all cart',
    responses: [
      { status: 200, description: 'Get all cart successfully' },
      { status: 400, description: 'Bad Request' },
    ],
  })
  async findAll(@Res() res: Response) {
    try {
      const cart = await this.cartService.findAll();
      this.handleResponse(res, !!cart, 'Get all carts', cart);
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }

  @GetApi({
    path: '/:id',
    summary: 'Get the cart',
    responses: [
      { status: 200, description: 'Get the cart successfully' },
      { status: 400, description: 'Bad Request' },
    ],
    param: { name: 'id', description: 'Card ID' },
  })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const cart = await this.cartService.findOne(id);
      this.handleResponse(res, !!cart, 'Get the cart', cart);
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateCartDto: UpdateCartDto,
  //   @Res() res: Response,
  // ) {
  //   try {
  //     if (cart) {
  //       successResponse(res, 'Cart created successfully', cart);
  //     }
  //     errorResponse(res, 'Cart creation failed');
  //   } catch (error) {
  //     if (!(error instanceof HttpException)) {
  //       throw new BadRequestException((error as Error).message);
  //     }
  //     throw error;
  //   }
  // }

  @DeleteApi({
    path: '/:id',
    summary: 'Delete the cart',
    responses: [
      { status: 200, description: 'Delete the cart successfully' },
      { status: 400, description: 'Bad Request' },
    ],
    param: { name: 'id', description: 'Card ID' },
  })
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const cart = await this.cartService.remove(id);
      this.handleResponse(res, !!cart, 'Delete the cart', cart);
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }

  @GetApi({
    path: '/:id/user',
    summary: 'Get the user',
    responses: [
      { status: 200, description: 'Get the user successfully' },
      { status: 400, description: 'BadRequest' },
    ],
    param: { name: 'id', description: 'Cart Id' },
  })
  async getUser(
    @Res() res: Response,
    @Param('id') id: string,
  ): Promise<Response | void> {
    try {
      const user = await this.cartService.getUser(id);
      this.handleResponse(res, !!user, 'Get the user of the cart', user);
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }

  @GetApi({
    path: '/:id/products',
    summary: 'Get the products',
    responses: [
      { status: 200, description: 'Get the products successfully' },
      { status: 400, description: 'BadRequest' },
    ],
    param: { name: 'id', description: 'Cart Id' },
  })
  async getProducts(
    @Res() res: Response,
    @Param('id') id: string,
  ): Promise<Response | void> {
    try {
      const products = await this.cartService.getProducts(id);

      this.handleResponse(
        res,
        !!products,
        'Get the products of the cart',
        products,
      );
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }
  @DeleteApi({
    path: '/:id/product/:productId',
    summary: 'Delete the product',
    responses: [
      { status: 200, description: 'Delete the product successfully' },
      { status: 400, description: 'Bad Request' },
    ],
    param: [
      { name: 'id', description: 'Card ID' },
      { name: 'productId', description: 'Product ID ' },
    ],
  })
  async removeProduct(
    @Res() res: Response,
    @Param('id') id: string,
    @Param('productId') productId: string,
  ): Promise<Response | void> {
    try {
      const cartItem = await this.cartService.removeProduct(id, productId);

      this.handleResponse(
        res,
        !!cartItem,
        'Delete the item of the cart',
        cartItem,
      );
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }
}
