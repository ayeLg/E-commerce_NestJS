import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';
import {
  ArrayPropOptions,
  BasePropOptions,
  MapPropOptions,
  PropOptionsForNumber,
  PropOptionsForString,
  VirtualOptions,
} from '@typegoose/typegoose/lib/types';

type TypegooseOptions =
  | BasePropOptions
  | ArrayPropOptions
  | MapPropOptions
  | PropOptionsForNumber
  | PropOptionsForString
  | VirtualOptions;

export default function Property(
  typegooseOptions: TypegooseOptions,
  apiOptions?: ApiPropertyOptions,
) {
  return (target: any, key: string) => {
    const { type, required } = typegooseOptions;

    if (typegooseOptions) {
      prop(typegooseOptions)(target, key);
    } else {
      prop()(target, key); // Use default `@prop` if no options are provided
    }
    ApiProperty({ type, required, ...apiOptions })(target, key);
  };
}
