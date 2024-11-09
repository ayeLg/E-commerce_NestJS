import { Ref } from '@typegoose/typegoose';
import { Wishlist } from '../wishlist/wishlist.model';
import { Product } from '../product/product.model';
import Property from 'src/util/decorator/model/property.decorator';
import { Types } from 'mongoose';

export class WishlistItem {
  @Property({ required: true, type: Types.ObjectId, ref: () => Wishlist })
  wishlistId: Ref<Wishlist>;

  @Property({ required: true, type: Types.ObjectId, ref: () => Product })
  productId: Ref<Product>;
}
