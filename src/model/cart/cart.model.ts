import { getModelForClass, Ref } from '@typegoose/typegoose';
import { User } from '../user/user.model';
import Property from 'src/util/decorator/model/property.decorator';
import { Document, Types } from 'mongoose';

enum CartSate {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED',
}

export class Cart extends Document {
  @Property({ required: true, type: Types.ObjectId, ref: () => User })
  userId: Ref<User>;

  @Property({
    required: false,
    type: String,
    default: CartSate.PENDING,
  })
  state: CartSate;

  @Property({ required: false, type: Number, default: 0 })
  deleteStatus: number;
}

export const CartModel = getModelForClass(Cart);
