import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryModel } from 'src/model/category/category.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(CategoryModel.modelName)
    private categoryModel: Model<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const category = await this.categoryModel.create(createCategoryDto);
      return category;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async findAll(): Promise<Category[]> {
    try {
      const category = await this.categoryModel.find();
      return category;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async findOne(id: string): Promise<Category | null> {
    try {
      const category = await this.categoryModel.findById(id);
      return category;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category | null> {
    try {
      const category = await this.categoryModel.findByIdAndUpdate(
        id,
        updateCategoryDto,
        { returnDocument: 'after' },
      );
      return category;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async remove(id: string): Promise<Category | null> {
    try {
      const category = await this.categoryModel.findByIdAndUpdate(
        id,
        { deleteStatus: 1 },
        { returnDocument: 'after' },
      );
      return category;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }
}
