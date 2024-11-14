import { Injectable, Logger } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Category } from 'src/model/category/category.model';
import { Product } from 'src/model/product/product.model';
import { User } from 'src/model/user/user.model';

@Injectable()
export class SwaggerConfig {
  private readonly logger = new Logger(SwaggerConfig.name);
  constructor(
    private configService: ConfigService, // Optional: inject config service
  ) {}

  createSwaggerConfig() {
    return (
      new DocumentBuilder()
        .setTitle(this.configService.get('SWAGGER_TITLE') || 'E-Commerce API')
        .setDescription('E-Commerce Application API Documentation')
        .setVersion(this.configService.get('APP_VERSION') || '1.0')
        .addBearerAuth()
        .addSecurityRequirements('bearer')
        // ... other configurations
        .build()
    );
  }

  setupSwagger(app: INestApplication) {
    try {
      const config = this.createSwaggerConfig();
      const document = SwaggerModule.createDocument(app, config, {
        extraModels: [User, Product, Category],
      });

      SwaggerModule.setup('api-docs', app, document, {
        swaggerOptions: {
          docExpansion: 'none',
          filter: true,
          showRequestDuration: true,
        },
      });

      this.logger.log('Swagger documentation initialized');
    } catch (error) {
      this.logger.error('Failed to set up Swagger', error);
    }
  }
}
