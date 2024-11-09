import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './model/database.module';
import { AuthModule } from './auth/auth.module';

import { ApplicationMiddleware } from './middleware /applicationi.middleware';

import { MiddlewareHelper } from './util/helper/middleware.helper';
import { ChecktokenMiddleware } from './middleware /checkToken.middleware';
import { SwaggerConfig } from './swagger/swagger.config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make config module global
      envFilePath: '.env', // Specify path to env file
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ApplicationMiddleware,
    ChecktokenMiddleware,
    MiddlewareHelper,
    SwaggerConfig,
  ],
})
export class AppModule {}
