import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModel } from 'src/model/user/user.model';
import { Model, Types } from 'mongoose';
import { Cart, CartModel } from 'src/model/cart/cart.model';
import { CartItem, CartItemModel } from 'src/model/cart_item /cartItem.model';

interface Product {
  _id: string;
  productName: string;
}

interface CartItemInterface {
  product: Product;
  quantity: number;
}

interface AddtoCart {
  _id: string;
  user: User;
  cartItems: CartItemInterface[];
}

@Injectable()
export class CartService {
  constructor(
    @InjectModel(UserModel.modelName) private userModel: Model<User>,
    @InjectModel(CartModel.modelName) private cartModel: Model<Cart>,
    @InjectModel(CartItemModel.modelName)
    private cartItemModel: Model<CartItem>,
  ) {}
  async create(createCartDto: CreateCartDto): Promise<Cart> {
    try {
      const user = await this.userModel.findById(createCartDto.userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const cart = await this.cartModel.create({ userId: user.id });

      return cart;
    } catch (error) {
      if (error instanceof HttpException) {
        throw Error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async findAll(): Promise<AddtoCart[] | null> {
    try {
      const cart = await this.cartModel.aggregate<AddtoCart>([
        // Match only carts with deleteStatus 0
        { $match: { deleteStatus: 0 } },

        // Lookup to get user details
        {
          $lookup: {
            from: 'users', // MongoDB collection name for users
            localField: 'userId',
            foreignField: '_id',
            as: 'userDetails',
          },
        },
        { $unwind: '$userDetails' }, // Unwind user details

        // Lookup to get cart items
        {
          $lookup: {
            from: 'cartitems', // MongoDB collection name for cartItems
            localField: '_id',
            foreignField: 'cartId',
            as: 'cartItems',
          },
        },

        // Ensure cartItems is always an array
        {
          $addFields: {
            cartItems: {
              $ifNull: ['$cartItems', []], // Replace null or missing cartItems with an empty array
            },
          },
        },

        // Lookup to get product details for each cart item
        {
          $lookup: {
            from: 'products', // MongoDB collection name for products
            localField: 'cartItems.productId',
            foreignField: '_id',
            as: 'productDetails',
          },
        },

        // Map over cartItems to include product details
        {
          $addFields: {
            cartItems: {
              $map: {
                input: '$cartItems',
                as: 'item',
                in: {
                  quantity: '$$item.quantity',
                  product: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: '$productDetails',
                          as: 'product',
                          cond: { $eq: ['$$product._id', '$$item.productId'] },
                        },
                      },
                      0,
                    ],
                  },
                },
              },
            },
          },
        },

        // Remove unnecessary fields and return structured output
        {
          $project: {
            _id: 1,
            user: '$userDetails',
            cartItems: 1,
          },
        },
      ]);

      return cart;
    } catch (error) {
      if (error instanceof HttpException) {
        throw Error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async findOne(id: string): Promise<AddtoCart | null> {
    try {
      const cart = await this.cartModel.aggregate<AddtoCart>([
        // Match only carts with deleteStatus 0
        { $match: { _id: new Types.ObjectId(id), deleteStatus: 0 } },
        // Lookup to get user details
        {
          $lookup: {
            from: 'users', // MongoDB collection name for users
            localField: 'userId',
            foreignField: '_id',
            as: 'userDetails',
          },
        },
        { $unwind: '$userDetails' }, // Unwind user details

        // Lookup to get cart items
        {
          $lookup: {
            from: 'cartitems', // MongoDB collection name for cartItems
            localField: '_id',
            foreignField: 'cartId',
            as: 'cartItems',
          },
        },

        // Ensure cartItems is always an array
        {
          $addFields: {
            cartItems: {
              $ifNull: ['$cartItems', []], // Replace null or missing cartItems with an empty array
            },
          },
        },

        // Lookup to get product details for each cart item
        {
          $lookup: {
            from: 'products', // MongoDB collection name for products
            localField: 'cartItems.productId',
            foreignField: '_id',
            as: 'productDetails',
          },
        },

        // Map over cartItems to include product details
        {
          $addFields: {
            cartItems: {
              $map: {
                input: '$cartItems',
                as: 'item',
                in: {
                  quantity: '$$item.quantity',
                  product: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: '$productDetails',
                          as: 'product',
                          cond: { $eq: ['$$product._id', '$$item.productId'] },
                        },
                      },
                      0,
                    ],
                  },
                },
              },
            },
          },
        },

        // Remove unnecessary fields and return structured output
        {
          $project: {
            _id: 1,
            user: '$userDetails',
            cartItems: 1,
          },
        },
      ]);
      return cart[0];
    } catch (error) {
      if (error instanceof HttpException) {
        throw Error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  // update(id: string, updateCartDto: UpdateCartDto) {
  //   try {
  //   } catch (error) {
  //     if (error instanceof HttpException) {
  //       throw Error;
  //     }
  //     throw new InternalServerErrorException((error as Error).message);
  //   }
  // }

  async remove(id: string, userId?: string): Promise<Cart> {
    try {
      const cart = await this.cartModel.findOneAndUpdate(
        { _id: new Types.ObjectId(id), ...(userId ? { userId: userId } : {}) },
        { deleteStatus: 1 },
        { new: true }, // Return the updated document
      );
      if (!cart) {
        throw new NotFoundException('there is no cart');
      }

      // Update all associated cart items
      await this.cartItemModel.updateMany(
        { cartId: cart.id }, // Find all cart items associated with the cart
        { deleteStatus: 1 }, // Mark them as deleted
      );
      return cart;
    } catch (error) {
      if (error instanceof HttpException) {
        throw Error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async getUser(id: string): Promise<User | null> {
    try {
      const user = await this.cartModel.aggregate<User>([
        { $match: { _id: new Types.ObjectId(id) } },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
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

      return user.length > 0 ? user[0] : null;
    } catch (error) {
      if (error instanceof HttpException) {
        throw Error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async getProducts(id: string): Promise<Product[] | null> {
    try {
      const products = await this.cartItemModel.aggregate<Product>([
        {
          $match: {
            cartId: new Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: 'productId',
            foreignField: '_id',
            as: 'products',
          },
        },
        { $unwind: '$products' },
        {
          $project: {
            _id: 0,
            quantity: 1,
            product: '$products',
          },
        },
      ]);
      return products;
    } catch (error) {
      if (error instanceof HttpException) {
        throw Error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async removeProduct(id: string, productId: string): Promise<CartItem | null> {
    try {
      const cartItem = await this.cartItemModel.findOne<CartItem>({
        cartId: new Types.ObjectId(id),
        productId: new Types.ObjectId(productId),
      });
      if (!cartItem) {
        throw new NotFoundException('Product not found');
      }
      cartItem.deleteStatus = 1;
      await cartItem.save();

      return cartItem;
    } catch (error) {
      if (error instanceof HttpException) {
        throw Error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }
}
