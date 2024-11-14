import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Review, ReviewModel } from 'src/model/review/review.model';
import { Model } from 'mongoose';
import { Product, ProductModel } from 'src/model/product/product.model';
import { User, UserModel } from 'src/model/user/user.model';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(ReviewModel.modelName) private reviewModel: Model<Review>,
    @InjectModel(ProductModel.modelName) private productModel: Model<Product>,
    @InjectModel(UserModel.modelName) private userModel: Model<User>,
  ) {}
  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    try {
      const product = await this.productModel.findById(
        createReviewDto.productId,
      );
      if (!product) {
        throw new ConflictException('Produnct not found');
      }
      const user = await this.userModel.findById(createReviewDto.userId);
      if (!user) {
        throw new ConflictException('User not found');
      }

      const review = await this.reviewModel.create(createReviewDto);

      return review;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async findAll(): Promise<Review[] | null> {
    try {
      const review = await this.reviewModel.find();
      return review;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async findOne(id: string): Promise<Review | null> {
    try {
      const review = await this.reviewModel.findById(id);
      return review;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async update(
    id: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<Review | null> {
    try {
      const review = await this.reviewModel.findByIdAndUpdate(
        id,
        updateReviewDto,
        { returnDocument: 'after' },
      );
      return review;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async remove(id: string): Promise<Review | null> {
    try {
      const review = await this.reviewModel.findByIdAndUpdate(
        id,
        { deleteStatus: 1 },
        { returnDocument: 'after' },
      );
      return review;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }
}
