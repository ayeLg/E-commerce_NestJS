import { Ref } from '@typegoose/typegoose';
import { Cart } from '../cart/cart.model';
import { Product } from '../product/product.model';
import Property from 'src/util/decorator/model/property.decorator';
import { Types } from 'mongoose';

export class CartItem {
  @Property({ required: true, type: Types.ObjectId, ref: () => Cart })
  cartId: Ref<Cart>;

  @Property({ required: true, type: Types.ObjectId, ref: () => Product })
  productId: Ref<Product>;

  @Property({ required: true, type: Number })
  quantity: number;
}
