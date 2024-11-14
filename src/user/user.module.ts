import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JWTHelper } from 'src/util/helper/jwt.helper';

import { ProductModule } from 'src/product/product.module';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [ProductModule, CartModule],
  controllers: [UserController],
  providers: [UserService, JWTHelper],
})
export class UserModule {}
