import {
  Body,
  Get,
  HttpException,
  HttpStatus,
  Next,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { NextFunction, Response } from 'express';
import { LoginDTO, RegisterDTO } from './dto/auth.dto';
import { errorResponse, successResponse } from 'src/util/helper/response.util';

import { ApiController } from 'src/util/decorator/swagger/apiController.decorator';
import { PostApi } from 'src/util/decorator/swagger/postApi.decorator';

@ApiController('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    @Next() next: NextFunction,
    @Body() authDto: RegisterDTO,
  ): Promise<Response | void> {
    try {
      const user = await this.authService.registerService(authDto);

      if (user) {
        successResponse(res, 'Successfully registered', user);
      } else {
        errorResponse(res, 'Registration failed');
      }
    } catch (error) {
      next(
        new HttpException(res, 400, {
          cause: 'error',
          description: (error as Error).message,
        }),
      );
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
    @Next() next: NextFunction,
    @Body() loginDTO: LoginDTO,
  ): Promise<Response | void> {
    try {
      const user = await this.authService.loginService(loginDTO);
      //check email exists
      if (user != null) {
        successResponse(res, 'login Successfully', user);
      } else {
        errorResponse(res, 'Wrong Password');
      }
    } catch (error) {
      next(
        new HttpException(res, 400, {
          cause: 'error',
          description: (error as Error).message,
        }),
      );
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
