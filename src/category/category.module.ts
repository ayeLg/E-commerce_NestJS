import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModel } from 'src/model/category/category.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CategoryModel.modelName,
        schema: CategoryModel.schema,
      },
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
