import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCartItemDto {
  @ApiProperty({
    description: 'User ID',
    type: String,
    required: true,
    example: '673053c0e112b5d860bc300d',
  })
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @ApiProperty({
    description: 'Cart ID',
    type: String,
    required: true,
    example: '673053c0e112b5d860bc300d',
  })
  @IsOptional()
  @IsMongoId()
  cartId: string;

  @ApiProperty({
    description: 'Product ID',
    type: String,
    required: true,
    example: '673053c0e112b5d860bc300d',
  })
  @IsNotEmpty()
  @IsMongoId()
  productId: string;

  @ApiProperty({
    description: 'quantity of purchased product',
    type: Number,
    required: true,
    example: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
