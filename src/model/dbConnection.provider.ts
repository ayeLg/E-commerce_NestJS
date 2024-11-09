import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { Connection, Mongoose } from 'mongoose';

@Injectable()
export class DbConnectionProvider {
  private static readonly logger = new Logger(Mongoose.name);

  private static initializeConnectionEvents(connection: Connection): void {
    connection.on('connected', () => {
      this.logger.log('Mongoose connected to DB');
    });

    connection.on('error', (err) => {
      this.logger.error('Connection error:', err);
    });

    connection.on('disconnected', () => {
      this.logger.warn('Mongoose disconnected');
    });

    connection.on('reconnected', () => {
      this.logger.log('Mongoose reconnected');
    });

    connection.on('open', () => {
      this.logger.log('Mongoose connection opened');
    });

    connection.on('close', () => {
      this.logger.warn('Mongoose connection closed');
    });
  }

  async connect(
    configService: ConfigService,
  ): Promise<MongooseModuleFactoryOptions> {
    const uri = `mongodb://${configService.get<string>('MONGO_DB_USER')}:${configService.get<string>('MONGO_DB_PASS')}@${configService.get<string>('MONGO_DB_HOST')}/${configService.get<string>('MONGO_DB_NAME')}?authSource=admin`;

    return {
      uri,
      onConnectionCreate: (connection) => {
        DbConnectionProvider.initializeConnectionEvents(connection);
        return connection;
      },
    };
  }
}
