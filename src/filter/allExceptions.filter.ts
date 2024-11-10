import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus(); // Extract HTTP status
    const message = exception.getResponse(); // Extract message or custom response
    console.log(status);

    // Custom handling logic
    response.status(status).json({
      statusCode: status,
      message: message,
      error: exception.name,
    });
  }
}
