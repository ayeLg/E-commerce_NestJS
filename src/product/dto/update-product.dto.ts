import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({ description: 'Product name ', example: 'Apple' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ description: 'Product description', example: 'apple' })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Product Price', example: 999.0 })
  @IsOptional()
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Product Quantity', example: 100 })
  @IsOptional()
  @IsNumber()
  quantity: number;
}
