import { Ref } from '@typegoose/typegoose';
import { User } from '../user/user.model';
import Property from 'src/util/decorator/model/property.decorator';
import { Types } from 'mongoose';

export class Wishlist {
  @Property({ required: true, type: Types.ObjectId, ref: () => User })
  userId: Ref<User>;
}
