import {
  BadRequestException,
  Body,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginDTO, RegisterDTO } from './dto/auth.dto';
import { errorResponse, successResponse } from 'src/util/helper/response.util';

import { ApiController } from 'src/util/decorator/swagger/apiController.decorator';
import { PostApi } from 'src/util/decorator/swagger/postApi.decorator';

@ApiController('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private handleResponse(
    res: Response,
    success: boolean,
    message: string,
    data?: any,
  ) {
    if (success) {
      return successResponse(res, message, data);
    } else {
      return errorResponse(res, message);
    }
  }
  @PostApi({
    path: '/register',
    summary: 'Register a new user',
    body: {
      type: RegisterDTO,
      description: 'User Registration Details',
    },
    responses: [
      { status: 201, description: 'User  successfully registered' },
      { status: 400, description: 'Bad Request' },
    ],
    httpCode: HttpStatus.CREATED,
  })
  async register(
    @Res() res: Response,
    @Body() authDto: RegisterDTO,
  ): Promise<Response | void> {
    try {
      const user = await this.authService.registerService(authDto);
      this.handleResponse(res, !!user, 'Registration', user);
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }

      throw error;
    }
  }

  @PostApi({
    path: '/login',
    summary: 'User Login',
    body: {
      type: LoginDTO,
      description: 'User Login Credentials',
    },
    responses: [
      { status: 200, description: 'Login Successfule ' },
      { status: 401, description: 'Unauthorized' },
    ],
  })
  async login(
    @Res() res: Response,
    @Body() loginDTO: LoginDTO,
  ): Promise<Response | void> {
    try {
      const user = await this.authService.loginService(loginDTO);

      this.handleResponse(res, !!user, 'Login', user);
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }

      throw error;
    }
  }

  @Post('/forgot-password')
  async forgotPassword(@Body('email') email: string) {
    await this.authService.forgotPassword(email);
    return {
      message: 'Password reset link sent to your email',
    };
  }

  @Get()
  test() {}
}
