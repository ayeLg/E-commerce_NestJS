import { applyDecorators, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

interface DeleteApiOptions {
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

export function DeleteApi({
  path,
  summary,
  responses,
  httpCode = HttpStatus.CREATED,
  param,
}: DeleteApiOptions) {
  const decorators = [
    Delete(path),
    ApiOperation({ summary }),
    HttpCode(httpCode),
  ];

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
