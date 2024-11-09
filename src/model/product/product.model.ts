import { getModelForClass } from '@typegoose/typegoose';
import Property from 'src/util/decorator/model/property.decorator';

export class Product {
  @Property(
    { required: true, type: String }, // Typegoose options
    { description: 'The name of the product', example: 'Apple' }, // Swagger options
  )
  name: string;

  @Property({ required: true, type: String }, { example: 'Apple' })
  description: string;

  @Property({ required: true, type: Number }, { example: 1000 })
  price: number;

  @Property({ required: false, type: Number, default: 0 }, { example: 99 })
  quantity: number;

  @Property({ required: false, type: Number, default: 0 }, { example: 0 })
  deleteStatus: number;
}

export const ProductModel = getModelForClass(Product);
