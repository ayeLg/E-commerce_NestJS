import {
  Body,
  Param,
  HttpException,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { errorResponse, successResponse } from 'src/util/helper/response.util';
import { Response } from 'express';
import { PostApi } from 'src/util/decorator/swagger/postApi.decorator';
import { ApiController } from 'src/util/decorator/swagger/apiController.decorator';
import { GetApi } from 'src/util/decorator/swagger/getApi.decorator';
import { PatchApi } from 'src/util/decorator/swagger/patch.decorator';
import { DeleteApi } from 'src/util/decorator/swagger/delete.decorator';

@ApiController('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @PostApi({
    path: '/',
    summary: 'Create a cart item ',
    responses: [
      { status: 200, description: 'Create cart item scuccssfully' },
      { status: 400, description: 'Bad Request' },
    ],
    body: {
      type: CreateCartItemDto,
      description: 'Create a cart item details',
    },
  })
  async create(
    @Body() createCartItemDto: CreateCartItemDto,
    @Res() res: Response,
  ) {
    try {
      const cartItem = await this.cartItemService.create(createCartItemDto);
      if (cartItem) {
        successResponse(res, 'Create cart item scuccssfully', cartItem);
        return;
      }
      errorResponse(res, 'Create cart item failed');
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }

  @GetApi({
    path: '/',
    summary: 'Get all cart item',
    responses: [
      { status: 200, description: 'Get all cart item scuccssfully' },
      { status: 400, description: 'Bad Request' },
    ],
  })
  async findAll(@Res() res: Response) {
    try {
      const cartItem = await this.cartItemService.findAll();
      if (cartItem) {
        successResponse(res, 'Get all cart item scuccssfully', cartItem);
        return;
      }
      errorResponse(res, 'Get all cart item failed');
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }

  @GetApi({
    path: '/:id',
    summary: 'Get the cart item ',
    responses: [
      { status: 200, description: 'Get all cart item scuccssfully' },
      { status: 400, description: 'Bad Request' },
    ],
    param: { name: 'id', description: 'CartItem ID' },
  })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const cartItem = await this.cartItemService.findOne(id);
      if (cartItem) {
        successResponse(res, 'Get the cart item scuccssfully', cartItem);
        return;
      }
      errorResponse(res, 'Get the cart item failed');
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }

  @PatchApi({
    path: '/:id',
    summary: 'Update the cart item',
    responses: [
      { status: 200, description: 'Update cart item scuccssfully' },
      { status: 400, description: 'Bad Request' },
    ],
    body: { type: UpdateCartItemDto, description: 'Cart Item Detail' },
    param: { name: 'id', description: 'Cart Item ID' },
  })
  async update(
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
    @Res() res: Response,
  ) {
    try {
      const cartItem = await this.cartItemService.update(id, updateCartItemDto);
      if (cartItem) {
        successResponse(res, 'Update cart item scuccssfully', cartItem);
        return;
      }
      errorResponse(res, 'Update cart item failed');
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }

  @DeleteApi({
    path: '/:id',
    summary: 'Delete the cart item',
    responses: [
      { status: 200, description: 'Delete cart item scuccssfully' },
      { status: 400, description: 'Bad Request' },
    ],

    param: { name: 'id', description: 'Cart Item ID' },
  })
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const cartItem = await this.cartItemService.remove(id);
      if (cartItem) {
        successResponse(res, 'Delete cart item scuccssfully', cartItem);
        return;
      }
      errorResponse(res, 'Create cart item failed');
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }

  @GetApi({
    path: '/:id/user',
    summary: 'Get the  user ',
    responses: [
      { status: 200, description: 'Get the user scuccssfully' },
      { status: 400, description: 'Bad Request' },
    ],
    param: { name: 'id', description: 'CartItem ID' },
  })
  async getUser(
    @Res() res: Response,
    @Param('id') id: string,
  ): Promise<Response | void> {
    try {
      const user = await this.cartItemService.getUser(id);
      if (user) {
        successResponse(res, 'Get the user scuccssfully', user);
        return;
      }
      errorResponse(res, 'Get the user failed');
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }
  @GetApi({
    path: '/:id/product',
    summary: 'Get the  product ',
    responses: [
      { status: 200, description: 'Get the product scuccssfully' },
      { status: 400, description: 'Bad Request' },
    ],
    param: { name: 'id', description: 'CartItem ID' },
  })
  async getProduct(
    @Res() res: Response,
    @Param('id') id: string,
  ): Promise<Response | void> {
    try {
      const product = await this.cartItemService.getProduct(id);
      if (product) {
        successResponse(res, 'Get the product scuccssfully', product);
        return;
      }
      errorResponse(res, 'Get the product failed');
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }

  @PatchApi({
    path: '/:id/increaseProduct',
    summary: 'Increase prodcut quantity',
    responses: [
      { status: 200, description: 'Increase prodcut quantity scuccssfully' },
      { status: 400, description: 'Bad Request' },
    ],

    param: { name: 'id', description: 'Cart Item ID' },
  })
  async increaseQuantity(@Param('id') id: string, @Res() res: Response) {
    try {
      const cartItem = await this.cartItemService.increaseQuantity(id);
      if (cartItem) {
        successResponse(
          res,
          'Increase prodcut quantity scuccssfully',
          cartItem,
        );
        return;
      }
      errorResponse(res, 'Increase prodcut quantityfailed');
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }

  @PatchApi({
    path: '/:id/decreaseProduct',
    summary: 'Decrease prodcut quantity',
    responses: [
      { status: 200, description: 'Increase prodcut quantity scuccssfully' },
      { status: 400, description: 'Bad Request' },
    ],
    param: { name: 'id', description: 'Cart Item ID' },
  })
  async decreaseQuantity(@Param('id') id: string, @Res() res: Response) {
    try {
      const cartItem = await this.cartItemService.decreaseQuantity(id);
      if (cartItem) {
        successResponse(
          res,
          'Increase prodcut quantity scuccssfully',
          cartItem,
        );
        return;
      }
      errorResponse(res, 'Increase prodcut quantityfailed');
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      throw error;
    }
  }
}
