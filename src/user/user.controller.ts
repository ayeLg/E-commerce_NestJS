import {
  Body,
  Param,
  Res,
  Req,
  HttpException,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request, Response } from 'express';
import { PostApi } from 'src/util/decorator/swagger/postApi.decorator';
import { ApiController } from 'src/util/decorator/swagger/apiController.decorator';
import { GetApi } from 'src/util/decorator/swagger/getApi.decorator';
import { PatchApi } from 'src/util/decorator/swagger/patch.decorator';
import { DeleteApi } from 'src/util/decorator/swagger/delete.decorator';
import { errorResponse, successResponse } from 'src/util/helper/response.util';
import { RoleGuard } from 'src/guard/role.guard';
import { Role } from 'src/util/decorator/role.decorator';

import { ProductService } from 'src/product/product.service';
import { AddProductDto } from './dto/add-product.dto';
import { CartService } from 'src/cart/cart.service';

@ApiController('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly productService: ProductService,
    private readonly cartService: CartService,
  ) {}

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
    summary: 'Create a new user',
    body: { type: CreateUserDto, description: 'Create detail user' },
    responses: [
      { status: 201, description: 'User successfully created' },
      { status: 400, description: 'Bad Request ' },
    ],
  })
  @UseGuards(RoleGuard)
  @Role('admin')
  async create(
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request,
    @Res()
    res: Response,
  ): Promise<Response | void> {
    try {
      const user = await this.userService.create(createUserDto);

      this.handleResponse(res, !!user, 'Create a user', user);
    } catch (error) {
      // Optional: Handle non-HttpException errors here
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      // Otherwise, let NestJS handle HttpExceptions automatically
      throw error;
    }
  }

  @GetApi({
    path: '/',
    summary: 'Get all user',
    responses: [
      { status: 200, description: 'Get all user successfully ' },
      { status: 404, description: 'Bad Request ' },
    ],
  })
  async findAll(
    @Req() req: Request,
    @Res()
    res: Response,
  ): Promise<Response | void> {
    try {
      const user = await this.userService.findAll();

      this.handleResponse(res, !!user, 'Gell all users', user);
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }

      throw error;
    }
  }

  @GetApi({
    path: '/:id',
    summary: 'Get a user',
    responses: [
      { status: 200, description: 'Get a user successfully ' },
      { status: 404, description: 'Bad Request ' },
    ],
    param: { name: 'id', description: 'User ID' },
  })
  async findOne(
    @Param('id') id: string,
    @Req() req: Request,
    @Res()
    res: Response,
  ): Promise<Response | void> {
    try {
      const user = await this.userService.findOne(id);

      this.handleResponse(res, !!user, 'Get the user', user);
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }

      throw error;
    }
  }

  @PatchApi({
    path: '/:id',
    summary: 'Update user',
    param: { name: 'id', description: 'User ID' },
    responses: [
      { status: 200, description: 'Update user successfully ' },
      { status: 404, description: 'Bad Request ' },
    ],
    body: {
      type: UpdateUserDto,
      description: 'Update user detail ',
    },
  })
  @UseGuards(RoleGuard)
  @Role('admin')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
    @Res()
    res: Response,
  ): Promise<Response | void> {
    try {
      const user = await this.userService.update(id, updateUserDto);

      this.handleResponse(res, !!user, 'Update the user', user);
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }

      throw error;
    }
  }

  @DeleteApi({
    path: '/:id',
    summary: 'Delete user',
    responses: [
      { status: 200, description: 'Delete user successfully' },
      { status: 404, description: 'Bad Request ' },
    ],
    param: { name: 'id', description: 'User ID' },
  })
  @UseGuards(RoleGuard)
  @Role('admin')
  async remove(
    @Param('id') id: string,
    @Req() req: Request,
    @Res()
    res: Response,
  ): Promise<Response | void> {
    try {
      const user = await this.userService.remove(id);

      this.handleResponse(res, !!user, 'Delete the user', user);
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }

      throw error;
    }
  }

  @PostApi({
    path: '/:id/products',
    summary: 'Add Product by User',
    responses: [
      { status: 200, description: 'Add product successfully' },
      { status: 400, description: 'Bad Request' },
    ],
    body: {
      type: AddProductDto,
      description: 'Product details',
    },
    param: { name: 'id', description: 'User Id' },
  })
  async addProduct(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() createProductDto: AddProductDto,
  ) {
    try {
      const product = await this.productService.create({
        userId: id,
        ...createProductDto,
      });

      this.handleResponse(res, !!product, 'Add product', product);
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }

      throw error;
    }
  }
  @GetApi({
    path: '/:id/products',
    summary: 'Get Products that are added by user',
    responses: [
      { status: 200, description: 'Get products  successfully' },
      { status: 400, description: 'Bad Resquest' },
    ],
    param: { name: 'id', description: 'User Id' },
  })
  async getProduct(
    @Res() res: Response,
    @Param('id') id: string,
  ): Promise<Response | void> {
    try {
      const products = await this.userService.getProduct(id);

      this.handleResponse(
        res,
        !!products,
        'Get the products that is added by user',
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
    path: '/:id/products/:productId',
    summary: 'Delete product ',
    responses: [
      { status: 200, description: 'Delete product successfully' },
      { status: 400, description: 'Bad Request' },
    ],
    param: [
      { name: 'id', description: 'User ID' },
      { name: 'productId', description: 'Product ID' },
    ],
  })
  async removeProduct(
    @Res() res: Response,
    @Param('id') id: string,
    @Param('productId') productId: string,
  ): Promise<Response | void> {
    try {
      const product = await this.userService.deleteProduct(id, productId);

      this.handleResponse(res, !!product, 'Delete the product', product);
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }

      throw error;
    }
  }

  @GetApi({
    path: '/:id/cart',
    summary: "Get a user's cart ",
    responses: [
      { status: 200, description: "Get user'cart successfully " },
      { status: 404, description: 'Bad Request ' },
    ],
    param: { name: 'id', description: 'User ID' },
  })
  async getCart(
    @Param('id') id: string,
    @Req() req: Request,
    @Res()
    res: Response,
  ): Promise<Response | void> {
    try {
      const cart = await this.userService.getCart(id);

      this.handleResponse(res, !!cart, 'Get the cart of the user', cart);
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }

      throw error;
    }
  }

  @DeleteApi({
    path: '/:id/cart/:cartId',
    summary: 'Delete Cart',
    responses: [
      { status: 200, description: "Delete user's cart Successfully" },
      { status: 400, description: 'Bad Request' },
    ],
    param: [
      { name: 'id', description: 'User ID' },
      { name: 'cartId', description: 'Cart ID' },
    ],
  })
  async deleteCart(
    @Res() res: Response,
    @Param('id') id: string,
    @Param('cartId') cartId: string,
  ) {
    try {
      const cart = await this.cartService.remove(cartId, id);
      if (cart) {
        successResponse(res, "Delete user's cart successfully", cart);
        return;
      } else {
        errorResponse(res, "Delete user's cart failed");
      }
      this.handleResponse(res, !!cart, 'Delete the cart of the user', cart);
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }

      throw error;
    }
  }

  @GetApi({
    path: '/:id/review',
    summary: 'Get Review',
    responses: [
      { status: 200, description: 'Get reviews successfully' },
      { status: 400, description: 'Bad Request' },
    ],
    param: { name: 'id', description: 'User ID' },
  })
  async getReview(
    @Res() res: Response,
    @Param('id') id: string,
  ): Promise<Response | void> {
    try {
      const review = await this.userService.getReview(id);

      this.handleResponse(
        res,
        !!review,
        'Get the reviews who is given by user',
        review,
      );
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }

      throw error;
    }
  }

  @GetApi({
    path: '/:id/cartItems',
    summary: 'Get items from cart',
    responses: [
      { status: 200, description: 'Get items from cart successfully' },
      { status: 400, description: 'Bad Request' },
    ],
    param: { name: 'id', description: 'User ID' },
  })
  async getCartItems(
    @Res() res: Response,
    @Param('id') id: string,
  ): Promise<Response | void> {
    try {
      const cartItems = await this.userService.getCartItems(id);

      this.handleResponse(
        res,
        !!cartItems,
        'Get the item of the cart of the user',
        cartItems,
      );
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }

      throw error;
    }
  }
}
