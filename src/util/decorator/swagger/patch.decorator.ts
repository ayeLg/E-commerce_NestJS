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
  param: { name: string; description: string };
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

  if (param) {
    decorators.push(
      ApiParam({ name: param.name, description: param.description }),
    );
  }

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
