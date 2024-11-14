import { getModelForClass } from '@typegoose/typegoose';
import { Document } from 'mongoose';
import Property from 'src/util/decorator/model/property.decorator';

export class Category extends Document {
  @Property({ required: true, type: String }, { example: 'Phone' })
  name: string;

  @Property({ required: false, type: Number, default: 0 })
  deleteStatus: number;
}

export const CategoryModel = getModelForClass(Category);
