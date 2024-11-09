import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DbConnectionProvider } from './dbConnection.provider';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule, DatabaseModule],
      inject: [ConfigService, DbConnectionProvider],
      useFactory: async (
        configService: ConfigService,
        dbConnectionProvider: DbConnectionProvider,
      ) => {
        return dbConnectionProvider.connect(configService);
      },
    }),
  ],
  providers: [DbConnectionProvider],
  exports: [DbConnectionProvider],
})
export class DatabaseModule {}
