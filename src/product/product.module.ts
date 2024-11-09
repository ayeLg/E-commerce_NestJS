import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductModel } from 'src/model/product/product.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductModel.modelName, schema: ProductModel.schema },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
