import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel } from 'src/model/user/user.model';
import { JWTHelper } from 'src/util/helper/jwt.helper';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserModel.modelName, schema: UserModel.schema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTHelper],
  exports: [JWTHelper, MongooseModule],
})
export class AuthModule {}
