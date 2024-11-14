import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModel } from 'src/model/user/user.model';
import { Model, Types } from 'mongoose';
import passwordHashing from 'src/util/helper/password.hashing';
import { JWTHelper } from 'src/util/helper/jwt.helper';
import { Cart, CartModel } from 'src/model/cart/cart.model';
import { CartItemModel } from 'src/model/cart_item /cartItem.model';
import { Product, ProductModel } from 'src/model/product/product.model';
import { Review, ReviewModel } from 'src/model/review/review.model';

interface ProductInterface {
  _id: string;
  productName: string;
}

interface CartItem {
  product: ProductInterface;
  quantity: number;
}

interface UserCart {
  userId: string;
  cartId: string;
  cartItems: CartItem[];
}

interface GetReivew {
  _id: string;
  rating: number;
  Comment: string;
  product: Product;
}

interface GetCartItems {
  cartId: string;
  cartItems: { product: Product; quantity: number }[];
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel.modelName) private userModel: Model<User>,
    private readonly jwtHelper: JWTHelper,
    @InjectModel(CartModel.modelName) private cartModel: Model<Cart>,
    @InjectModel(CartItemModel.modelName)
    private cartItemModel: Model<CartItem>,
    @InjectModel(ProductModel.modelName) private productModel: Model<Product>,
    @InjectModel(ReviewModel.modelName) private reviewModel: Model<Review>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Check if user already exists
      const existingUser = await this.userModel.findOne({
        email: createUserDto.email,
      });

      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      // Hash password
      const hashedPassword = await passwordHashing.hashPassword(
        createUserDto.password,
      );

      const user = await this.userModel.create({
        ...createUserDto,
        password: hashedPassword,
      });

      const token = this.jwtHelper.generateToken({
        user_id: user._id,
        userType: user.type,
      });

      user.token = token;
      await user.save();
      // Remove sensitive data
      user.password = undefined;

      return user;
    } catch (error) {
      // Re-throw the original error if it's already an HttpException
      if (error instanceof HttpException) {
        throw error;
      }

      // Wrap other errors in a custom or generic HttpException
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async findAll(): Promise<User[] | null> {
    try {
      const user = await this.userModel.find();
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async findOne(id: string): Promise<User | null> {
    try {
      const user = await this.userModel.findById(id);
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    try {
      const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
        returnDocument: 'after',
      });

      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async remove(id: string): Promise<User | null> {
    try {
      const user = await this.userModel.findByIdAndUpdate(
        id,
        {
          deleteStatus: 1,
        },
        { returnDocument: 'after' },
      );
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async getProduct(id: string): Promise<Product[] | null> {
    try {
      // const product = await this.userModel.aggregate([
      //   {
      //     $match: {
      //       _id: new Types.ObjectId(id),
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: 'products',
      //       localField: '_id',
      //       foreignField: 'userId',
      //       as: 'products',
      //     },
      //   },
      //   {
      //     $unwind: {
      //       path: '$products', // Unwind the products array to get individual product documents
      //       preserveNullAndEmptyArrays: true, // Keep the user document even if no products are found
      //     },
      //   },
      //   {
      //     $replaceRoot: { newRoot: '$products' }, // Replace the root with the product document
      //   },
      // ]);
      // console.log(product);

      const products = await this.productModel.find({
        userId: id,
      });
      return products;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async deleteProduct(id: string, productId: string): Promise<Product | null> {
    try {
      const product = await this.productModel.findOne<Product>({
        _id: productId,
        userId: id,
      });
      if (!product) {
        throw new NotFoundException(
          'Product not found or does not belong to this user.',
        );
      }
      product.deleteStatus = 1;
      await product.save();
      return product;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async getCart(id: string) {
    try {
      const cart = await this.userModel.aggregate<UserCart>([
        {
          $match: {
            _id: new Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: 'carts', // Name of the cart collection
            localField: '_id', // Field in the user collection
            foreignField: 'userId', // Field in the cart collection
            as: 'cart', // Name of the resulting array
          },
        },
        { $unwind: '$cart' }, // Flatten the cart array
        {
          $lookup: {
            from: 'cartitems', // Name of the cart items collection
            localField: 'cart._id', // Field in the cart collection
            foreignField: 'cartId', // Field in the cart items collection
            as: 'cartItems', // Name of the resulting array
          },
        },
        { $unwind: '$cartItems' }, // Flatten the cartItems array
        {
          $lookup: {
            from: 'products', // Name of the product collection
            localField: 'cartItems.productId', // Field in the cart items collection
            foreignField: '_id', // Field in the product collection
            as: 'cartItems.product', // Add product details to cartItems
          },
        },
        { $unwind: '$cartItems.product' }, // Flatten the product array
        {
          $group: {
            _id: '$_id', // Grouping by user ID
            userId: { $first: '$_id' }, // Include userId
            cartId: { $first: '$cart._id' }, // Include cartId
            cartItems: {
              $push: {
                product: '$cartItems.product',
                quantity: '$cartItems.quantity',
              },
            },
          },
        },
      ]);
      return cart;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async getReview(id: string): Promise<GetReivew[] | null> {
    try {
      const review = await this.reviewModel.aggregate<GetReivew>([
        {
          $match: {
            userId: new Types.ObjectId(id),
          },
        },
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
            _id: 1,
            rating: 1,
            comment: 1,
            product: '$product',
          },
        },
      ]);

      return review;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async getCartItems(id: string): Promise<GetCartItems | null> {
    try {
      const cartItems = await this.cartModel.aggregate<GetCartItems>([
        {
          $match: { userId: new Types.ObjectId(id) },
        },
        {
          $lookup: {
            from: 'cartitems', // Collection name for cart items
            localField: '_id', // Field in the cart collection
            foreignField: 'cartId', // Field in the cart items collection
            as: 'cartItems', // Name of the resulting array
          },
        },
        {
          $unwind: {
            path: '$cartItems', // Unwind the cartItems array
            preserveNullAndEmptyArrays: true, // Keep carts without items
          },
        },
        {
          $lookup: {
            from: 'products', // Collection name for products
            localField: 'cartItems.productId', // Field in the cart items collection
            foreignField: '_id', // Field in the products collection
            as: 'product', // Name of the resulting array
          },
        },
        {
          $unwind: {
            path: '$product', // Unwind the product array
            preserveNullAndEmptyArrays: true, // Keep items without products
          },
        },
        {
          $group: {
            _id: '$_id', // Group by cart ID
            cartId: { $first: '$_id' }, // Include cartId
            cartItems: {
              $push: {
                product: '$product', // Include product details
                quantity: '$cartItems.quantity', // Include quantity
              },
            },
          },
        },
        {
          $project: {
            _id: 0, // Exclude the default _id field
            cartId: 1,
            cartItems: 1,
          },
        },
      ]);
      return cartItems[0];
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }
}
