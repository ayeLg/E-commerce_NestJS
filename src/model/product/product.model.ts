import { getModelForClass, Ref } from '@typegoose/typegoose';
import { Document, Types } from 'mongoose';
import Property from 'src/util/decorator/model/property.decorator';
import { User } from '../user/user.model';

export class Product extends Document {
  @Property({ required: true, type: Types.ObjectId, ref: () => User })
  userId: Ref<User>;

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
