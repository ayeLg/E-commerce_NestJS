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
  param?:
    | { name: string; description: string }
    | { name: string; description: string }[];
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
    if (Array.isArray(param)) {
      param.forEach((p) => {
        decorators.push(ApiParam({ name: p.name, description: p.description }));
      });
    } else {
      decorators.push(
        ApiParam({ name: param.name, description: param.description }),
      );
    }
  }

  return applyDecorators(...decorators);
}
