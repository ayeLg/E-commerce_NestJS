import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartModel } from 'src/model/cart/cart.model';
import { Model, Types } from 'mongoose';
import { CartItem, CartItemModel } from 'src/model/cart_item /cartItem.model';
import { User, UserModel } from 'src/model/user/user.model';
import { Product, ProductModel } from 'src/model/product/product.model';
import { CartService } from 'src/cart/cart.service';

interface AddtoCart {
  user: User;
  cartId: string;
  cartItem: {
    _id: string;
    product: Product;
    quantity: number;
  };
}

@Injectable()
export class CartItemService {
  constructor(
    @InjectModel(CartModel.modelName) private cartModel: Model<Cart>,
    @InjectModel(CartItemModel.modelName)
    private cartItemModel: Model<CartItem>,
    @InjectModel(UserModel.modelName) private userModel: Model<User>,
    @InjectModel(ProductModel.modelName) private productModel: Model<Product>,
    @Inject(CartService) private cartService: CartService,
  ) {}

  async create(createCartItemDto: CreateCartItemDto): Promise<AddtoCart> {
    try {
      const user = await this.userModel.findById(createCartItemDto.userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }
      const product = await this.productModel.findById(
        createCartItemDto.productId,
      );

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      if (!createCartItemDto.cartId) {
        const checkCartId = await this.cartModel.countDocuments({
          userId: createCartItemDto.userId,
        });
        if (checkCartId) {
          throw new HttpException(
            'Cart is already created by the user. Must be included cartId in request',
            400,
          );
        }
        const cart = await this.cartService.create({
          userId: createCartItemDto.userId,
        });
        createCartItemDto.cartId = cart._id as string;
      }
      const cartItem = await this.cartItemModel.create(createCartItemDto);

      return {
        user: user,
        cartId: createCartItemDto.cartId,
        cartItem: {
          _id: cartItem.id,
          product: product,
          quantity: cartItem.quantity,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async findAll(): Promise<CartItem[] | null> {
    try {
      const cart = await this.cartItemModel.find();
      return cart;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async findOne(id: string): Promise<CartItem | null> {
    try {
      const cartItem = await this.cartItemModel.findById(id);

      return cartItem;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async update(
    id: string,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem | null> {
    try {
      const cartItem = await this.cartItemModel.findById(id);
      if (!cartItem) {
        throw new NotFoundException('Cart item not found');
      }
      const updatedCartItem = await this.cartItemModel.findByIdAndUpdate(
        id,
        { quantity: updateCartItemDto.quantity },
        { returnDocument: 'after' },
      );
      return updatedCartItem;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async remove(id: string): Promise<CartItem | null> {
    try {
      const cartItem = await this.cartItemModel.findById(id);
      if (!cartItem) {
        throw new NotFoundException('Cart item not found');
      }
      const updatedCartItem = await this.cartItemModel.findByIdAndUpdate(
        id,
        { deleteStatus: 1 },
        { returnDocument: 'after' },
      );
      return updatedCartItem;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async getUser(id: string): Promise<User | null> {
    try {
      const user = await this.cartItemModel.aggregate<User>([
        { $match: { _id: new Types.ObjectId(id) } },
        {
          $lookup: {
            from: 'carts',
            localField: 'cartId',
            foreignField: '_id',
            as: 'cart',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'cart.userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: '$user' },
        {
          $project: {
            _id: '$user._id',
            firstName: '$user.firstName',
            lastName: '$user.lastName',
            email: '$user.email',
            phone: '$user.phone',
            gender: '$user.gender',
            type: '$user.type',
          },
        },
      ]);
      console.log(user);

      return user[0];
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async getProduct(id: string): Promise<Product | null> {
    try {
      const product = await this.cartItemModel.aggregate<Product>([
        { $match: { _id: new Types.ObjectId(id) } },
        {
          $lookup: {
            from: 'products',
            localField: 'productId',
            foreignField: '_id',
            as: 'product',
          },
        },
        { $unwind: '$product' },
        {
          $project: {
            name: '$prdouct.name',
            description: '$product.description',
            price: '$product.price',
            quantity: '$product.quantity',
          },
        },
      ]);
      return product[0];
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async increaseQuantity(id: string): Promise<CartItem | null> {
    try {
      const cartItem = await this.cartItemModel.findById(id);
      if (!cartItem) {
        throw new NotFoundException('Product Not Found');
      }
      cartItem.quantity = cartItem.quantity + 1;
      await cartItem.save();
      return cartItem;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async decreaseQuantity(id: string): Promise<CartItem | null> {
    try {
      const cartItem = await this.cartItemModel.findById(id);
      if (!cartItem) {
        throw new NotFoundException('Product Not Found');
      }
      console.log(cartItem);

      if (cartItem.quantity <= 0) {
        throw new HttpException(
          "Quantity is reached minmiumn limit. You can't reduce the quantity further",
          400,
        );
      }
      cartItem.quantity = cartItem.quantity - 1;
      await cartItem.save();
      return cartItem;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }
}
