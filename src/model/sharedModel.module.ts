import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartModel } from './cart/cart.model';
import { CartItemModel } from './cart_item /cartItem.model';
import { UserModel } from './user/user.model';
import { ProductModel } from './product/product.model';
import { ReviewModel } from './review/review.model';

@Global() // Makes this module globally available
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CartModel.modelName, schema: CartModel.schema },
      { name: CartItemModel.modelName, schema: CartItemModel.schema },
      { name: UserModel.modelName, schema: UserModel.schema },
      { name: ProductModel.modelName, schema: ProductModel.schema },
      { name: ReviewModel.modelName, schema: ReviewModel.schema },
    ]),
  ],
  exports: [MongooseModule], // Export MongooseModule to be available elsewhere
})
export class SharedModelsModule {}
