import { applyDecorators, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

interface GetApiOptions {
  path: string;
  summary: string;
  responses?: {
    status: number;
    description: string;
    type?: any;
  }[];
  httpCode?: HttpStatus;
  param?: string;
}

export function GetApi({
  path,
  summary,
  responses,
  httpCode = HttpStatus.CREATED,
  param,
}: GetApiOptions) {
  const decorators = [Get(path), ApiOperation({ summary }), HttpCode(httpCode)];

  // Add ApiResponses
  if (responses) {
    const apiResponses = responses.map((response) =>
      ApiResponse({
        status: response.status,
        description: response.description,
        type: response.type,
      }),
    );
    decorators.push(...apiResponses);
  }

  // Add ApiBody using model
  if (param) {
    decorators.push(ApiParam({ name: param }));
  }

  return applyDecorators(...decorators);
}
