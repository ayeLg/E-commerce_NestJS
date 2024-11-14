import { getModelForClass, Ref } from '@typegoose/typegoose';

import Property from 'src/util/decorator/model/property.decorator';
import { User } from '../user/user.model';

import { Date, Document, Types } from 'mongoose';

enum OrderState {
  PENDING = 'PENDING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export class Order extends Document {
  @Property({ required: true, type: Types.ObjectId, ref: () => User })
  userId: Ref<User>;

  @Property({ required: true, type: Date })
  orderDate: Date;

  @Property({ required: false, type: OrderState, default: OrderState.PENDING })
  status: OrderState;

  @Property({ required: true, type: Number })
  totalAmount: number;
}
export const OrderModel = getModelForClass(Order);
