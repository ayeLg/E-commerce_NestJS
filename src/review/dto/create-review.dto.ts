import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ description: 'Proudct ID ', example: '23424234234' })
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty({ description: 'User ID ', example: '23424234234' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Rating score ', example: '23424234234' })
  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @ApiProperty({ description: 'comment ', example: 'good' })
  @IsNotEmpty()
  @IsString()
  comment: string;
}
