import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel } from 'src/model/user/user.model';
import { JWTHelper } from 'src/util/helper/jwt.helper';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserModel.modelName, schema: UserModel.schema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, JWTHelper],
})
export class UserModule {}
