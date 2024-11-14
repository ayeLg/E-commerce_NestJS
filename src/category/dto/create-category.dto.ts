import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category Name', example: 'Mobile Phone' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
