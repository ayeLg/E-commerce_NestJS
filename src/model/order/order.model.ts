import { Ref } from '@typegoose/typegoose';

import Property from 'src/util/decorator/model/property.decorator';
import { User } from '../user/user.model';

import { Date, Types } from 'mongoose';

enum OrderState {
  PENDING = 'PENDING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export class Order {
  @Property({ required: true, type: Types.ObjectId, ref: () => User })
  userId: Ref<User>;

  @Property({ required: true, type: Date })
  orderDate: Date;

  @Property({ required: false, type: OrderState, default: OrderState.PENDING })
  status: OrderState;

  @Property({ required: true, type: Number })
  totalAmount: number;
}
