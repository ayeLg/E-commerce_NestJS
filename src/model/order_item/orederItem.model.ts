import { Ref } from '@typegoose/typegoose';
import { Order } from '../order/order.model';
import { Product } from '../product/product.model';
import Property from 'src/util/decorator/model/property.decorator';
import { Types } from 'mongoose';

export class OrderItem extends Document {
  @Property({ required: true, type: Types.ObjectId, ref: () => Order })
  orderId: Ref<Order>;

  @Property({ required: true, type: Types.ObjectId, ref: () => Product })
  productId: Ref<Product>;

  @Property({ required: true, type: Number })
  quantity: number;

  @Property({ required: true, type: Number })
  price: number;
}
