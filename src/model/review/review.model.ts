import { Ref } from '@typegoose/typegoose';
import { Product } from '../product/product.model';
import { User } from '../user/user.model';
import Property from 'src/util/decorator/model/property.decorator';
import { Types } from 'mongoose';

export class Review {
  @Property({ required: true, type: Types.ObjectId, ref: () => Product })
  productId: Ref<Product>;

  @Property({ required: true, type: Types.ObjectId, ref: () => User })
  userId: Ref<User>;

  @Property({ required: true, type: Number })
  rating: number;

  @Property({ required: true, type: String })
  comment: string;
}
