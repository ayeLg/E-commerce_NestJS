import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    required: true,
    description: "who's add this product",
    example: '673053c0e112b5d860bc300d',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

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
