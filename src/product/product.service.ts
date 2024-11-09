import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductModel } from 'src/model/product/product.model';
import { Model } from 'mongoose';
import { Product } from './entities/product.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ProductModel.modelName) private productModel: Model<Product>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const product = await this.productModel.create(createProductDto);
    console.log(product);

    return product;
  }

  async findAll() {
    const products = await this.productModel.find();
    return products;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
