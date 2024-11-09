// decorators/api-controller.decorator.ts
import { Controller, applyDecorators } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export function ApiController(route: string, tag?: string) {
  return applyDecorators(Controller(route), ApiTags(tag || route));
}
