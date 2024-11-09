import { Module } from '@nestjs/common';
import { SwaggerConfig } from './swagger.config';

@Module({
  providers: [SwaggerConfig],
  exports: [SwaggerConfig],
})
export class SwaggerModule {}
