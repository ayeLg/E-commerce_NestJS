import { getModelForClass, Ref } from '@typegoose/typegoose';
import { Wishlist } from '../wishlist/wishlist.model';
import { Product } from '../product/product.model';
import Property from 'src/util/decorator/model/property.decorator';
import { Document, Types } from 'mongoose';

export class WishlistItem extends Document {
  @Property({ required: true, type: Types.ObjectId, ref: () => Wishlist })
  wishlistId: Ref<Wishlist>;

  @Property({ required: true, type: Types.ObjectId, ref: () => Product })
  productId: Ref<Product>;
}
export const WishListItemModel = getModelForClass(WishlistItem);
