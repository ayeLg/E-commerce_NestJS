import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JWTHelper } from 'src/util/helper/jwt.helper';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, JWTHelper],
  exports: [JWTHelper],
})
export class AuthModule {}
