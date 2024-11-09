import { Body, Param, Res, Next, Req, HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NextFunction, Request, Response } from 'express';
import { PostApi } from 'src/util/decorator/swagger/postApi.decorator';
import { ApiController } from 'src/util/decorator/swagger/apiController.decorator';
import { GetApi } from 'src/util/decorator/swagger/getApi.decorator';
import { PatchApi } from 'src/util/decorator/swagger/patch.decorator';
import { DeleteApi } from 'src/util/decorator/swagger/delete.decorator';

@ApiController('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @PostApi({
    path: '/',
    summary: 'Create a new user',
    body: { type: CreateUserDto, description: 'Create detail user' },
    responses: [
      { status: 201, description: 'User successfully created' },
      { status: 400, description: 'Bad Request ' },
    ],
  })
  async create(
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request,
    @Res()
    res: Response,
    @Next() next: NextFunction,
  ): Promise<Response | void> {
    try {
      console.log('Hello');
    } catch (error) {
      next(
        new HttpException(res, 400, {
          cause: 'error',
          description: (error as Error).message,
        }),
      );
    }
  }

  @GetApi({
    path: '/',
    summary: 'Get all user',
    responses: [
      { status: 200, description: 'Get all user successfully ' },
      { status: 404, description: 'Bad Request ' },
    ],
  })
  async findAll(
    @Req() req: Request,
    @Res()
    res: Response,
    @Next() next: NextFunction,
  ): Promise<Response | void> {
    try {
    } catch (error) {
      next(
        new HttpException(res, 400, {
          cause: 'error',
          description: (error as Error).message,
        }),
      );
    }
  }

  @GetApi({
    path: '/:id',
    summary: 'Get a user',
    responses: [
      { status: 200, description: 'Get a user successfully ' },
      { status: 404, description: 'Bad Request ' },
    ],
    param: 'User ID ',
  })
  findOne(
    @Param('id') id: string,
    @Req() req: Request,
    @Res()
    res: Response,
    @Next() next: NextFunction,
  ): Promise<Response | void> {
    try {
      return;
    } catch (error) {
      next(
        new HttpException(res, 400, {
          cause: 'error',
          description: (error as Error).message,
        }),
      );
    }
  }

  @PatchApi({
    path: '/:id',
    summary: 'Update user',
    param: 'User ID',
    responses: [
      { status: 200, description: 'Update user successfully ' },
      { status: 404, description: 'Bad Request ' },
    ],
    body: {
      type: UpdateUserDto,
      description: 'Update user detail ',
    },
  })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
    @Res()
    res: Response,
    @Next() next: NextFunction,
  ): Promise<Response | void> {
    try {
      return;
    } catch (error) {
      next(
        new HttpException(res, 400, {
          cause: 'error',
          description: (error as Error).message,
        }),
      );
    }
  }

  @DeleteApi({
    path: '/:id',
    summary: 'Delete user',
    responses: [
      { status: 200, description: 'Delete user successfully' },
      { status: 404, description: 'Bad Request ' },
    ],
    param: 'User ID',
  })
  remove(
    @Param('id') id: string,
    @Req() req: Request,
    @Res()
    res: Response,
    @Next() next: NextFunction,
  ): Promise<Response | void> {
    try {
      return;
    } catch (error) {
      next(
        new HttpException(res, 400, {
          cause: 'error',
          description: (error as Error).message,
        }),
      );
    }
  }
}
