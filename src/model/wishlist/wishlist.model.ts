import { getModelForClass, Ref } from '@typegoose/typegoose';
import { User } from '../user/user.model';
import Property from 'src/util/decorator/model/property.decorator';
import { Document, Types } from 'mongoose';

export class Wishlist extends Document {
  @Property({ required: true, type: Types.ObjectId, ref: () => User })
  userId: Ref<User>;
}

export const WishlistModel = getModelForClass(Wishlist);
