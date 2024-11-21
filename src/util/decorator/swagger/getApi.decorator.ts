import { applyDecorators, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

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

  query?:
    | { name: string; description: string; required: boolean }
    | { name: string; description: string; required: boolean }[];
}

export function GetApi({
  path,
  summary,
  responses,
  httpCode = HttpStatus.CREATED,
  param,
  query,
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
  // Add ApiQuery using model
  if (query) {
    if (Array.isArray(query)) {
      query.forEach((q) => {
        decorators.push(
          ApiQuery({
            name: q.name,
            description: q.description,
            required: q.required,
          }),
        );
      });
    } else {
      decorators.push(
        ApiQuery({
          name: query.name,
          description: query.description,
          required: query.required,
        }),
      );
    }
  }

  return applyDecorators(...decorators);
}
