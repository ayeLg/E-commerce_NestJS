import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddProductDto {
  @ApiProperty({ description: 'Product name ', example: 'Apple' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Product description', example: 'apple' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Product Price', example: 999.0 })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Product Quantity', example: 100 })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
