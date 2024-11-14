import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({ description: 'User ID', example: '673047458e558000cd62630a' })
  @IsNotEmpty()
  @IsString()
  userId: string;
}
