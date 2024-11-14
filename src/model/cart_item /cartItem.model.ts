import { getModelForClass, Ref } from '@typegoose/typegoose';
import { Cart } from '../cart/cart.model';
import { Product } from '../product/product.model';
import Property from 'src/util/decorator/model/property.decorator';
import { Document, Types } from 'mongoose';

export class CartItem extends Document {
  @Property({ required: true, type: Types.ObjectId, ref: () => Cart })
  cartId: Ref<Cart>;

  @Property({ required: true, type: Types.ObjectId, ref: () => Product })
  productId: Ref<Product>;

  @Property({ required: true, type: Number })
  quantity: number;

  @Property({ required: false, type: Number, default: 0 })
  deleteStatus: number;
}

export const CartItemModel = getModelForClass(CartItem);
