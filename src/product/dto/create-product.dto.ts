import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Product name is required' })
  @IsString({ message: 'Product name must be a string' })
  readonly name: string;

  @IsNotEmpty({ message: 'Product price is required' })
  @IsNumber({}, { message: 'Product price must be a number' })
  readonly price: number;

  @IsNotEmpty({ message: 'Product quantity is required' })
  @IsNumber({}, { message: 'Product quantity must be a number' })
  readonly quantity: number;
}
