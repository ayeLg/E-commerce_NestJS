import { Post, HttpCode, HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

interface PostApiOptions {
  path: string;
  summary: string;
  responses?: {
    status: number;
    description: string;
    type?: any;
  }[];
  httpCode?: HttpStatus;
  body?: {
    type: any;
    description?: string;
  };
}

export function PostApi({
  path,
  summary,
  responses,
  httpCode = HttpStatus.CREATED,
  body,
}: PostApiOptions) {
  const decorators = [
    Post(path),
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
