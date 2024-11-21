import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddProductDto {
  @ApiProperty({
    required: true,
    description: 'Category ID',
    example: '673053c0e112b5d860bc300d',
  })
  @IsNotEmpty()
  @IsString()
  categoryId: string;

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
