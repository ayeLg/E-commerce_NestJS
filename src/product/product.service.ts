import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductModel } from 'src/model/product/product.model';
import { Model, Types } from 'mongoose';
import { Product } from './entities/product.entity';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/model/user/user.model';
import { Review, ReviewModel } from 'src/model/review/review.model';

interface UserByProduct {
  user: User;
}
@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ProductModel.modelName) private productModel: Model<Product>,
    @InjectModel(ReviewModel.modelName) private reviewModel: Model<Review>,
  ) {}
  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const product = await this.productModel.create(createProductDto);
      return product;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      const products = await this.productModel.find();
      return products;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async findOne(id: string): Promise<Product> {
    try {
      const product = await this.productModel.findById(id);
      return product;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      const product = await this.productModel.findByIdAndUpdate(
        id,
        updateProductDto,
        { returnDocument: 'after' },
      );
      return product;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async remove(id: string): Promise<Product> {
    try {
      const product = await this.productModel.findByIdAndUpdate(
        id,
        { deleteStatus: 0 },
        { new: true },
      );
      return product;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async getUserWhoAdded(id: string): Promise<User | null> {
    try {
      const user = await this.productModel.aggregate<UserByProduct>([
        {
          $match: { _id: new Types.ObjectId(id) },
        },
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
            _id: 0,
            user: '$user',
          },
        },
      ]);
      return user[0]?.user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async getUserWhoReviewed(id: string): Promise<User[] | null> {
    try {
      const user = await this.reviewModel.aggregate<User>([
        { $match: { productId: new Types.ObjectId(id) } },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'users',
          },
        },
        { $unwind: '$users' },
        {
          $project: {
            _id: '$users._id',
            firstName: '$users.firstName',
            lastName: '$users.lastName',
            email: '$users.email',
            password: '$users.password',
            phone: '$users.phone',
            gender: '$users.gender',
            type: '$users.type',
          },
        },
      ]);
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async getReview(id: string): Promise<Review[] | null> {
    try {
      const reviews = await this.reviewModel.find({
        productId: new Types.ObjectId(id),
      });
      return reviews;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }
}
