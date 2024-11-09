import { applyDecorators, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

interface PatchApiOptions {
  path: string;
  summary: string;
  responses?: {
    status: number;
    description: string;
    type?: any;
  }[];
  httpCode?: HttpStatus;
  param: string;
  body: {
    type: any;
    description?: string;
  };
}

export function PatchApi({
  path,
  summary,
  responses,
  httpCode = HttpStatus.CREATED,
  param,
  body,
}: PatchApiOptions) {
  const decorators = [
    Patch(path),
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
  // Add ApiBody using model
  if (body) {
    decorators.push(
      ApiBody({
        type: body.type,
        description: body.description || `Payload for ${summary}`,
      }),
    );
  }
  return applyDecorators(...decorators);
}
