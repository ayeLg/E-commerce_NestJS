import { Ref } from '@typegoose/typegoose';
import { Order } from '../order/order.model';
import Property from 'src/util/decorator/model/property.decorator';
import { Types } from 'mongoose';

enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  PAYPAL = 'PAYPAL',
  BANK = 'BANK',
}

enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export class Payment extends Document {
  @Property({ required: true, type: Types.ObjectId, ref: () => Order })
  orderId: Ref<Order>;

  @Property({ required: true, type: String })
  paymentDate: string;

  @Property({ required: true, type: Number })
  amount: number;

  @Property({
    required: true,
    type: PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @Property({
    required: false,
    type: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;
}
