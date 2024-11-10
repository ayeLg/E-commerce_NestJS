import {
  Body,
  Param,
  Res,
  Req,
  HttpException,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request, Response } from 'express';
import { PostApi } from 'src/util/decorator/swagger/postApi.decorator';
import { ApiController } from 'src/util/decorator/swagger/apiController.decorator';
import { GetApi } from 'src/util/decorator/swagger/getApi.decorator';
import { PatchApi } from 'src/util/decorator/swagger/patch.decorator';
import { DeleteApi } from 'src/util/decorator/swagger/delete.decorator';
import { errorResponse, successResponse } from 'src/util/helper/response.util';
import { RoleGuard } from 'src/guard/role.guard';
import { Role } from 'src/util/decorator/role.decorator';

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
  @UseGuards(RoleGuard)
  @Role('admin')
  async create(
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request,
    @Res()
    res: Response,
  ): Promise<Response | void> {
    try {
      const user = await this.userService.create(createUserDto);

      if (user) {
        successResponse(res, 'User created successfully', user);
      } else {
        errorResponse(res, 'User creation failed');
      }
    } catch (error) {
      // Optional: Handle non-HttpException errors here
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }
      // Otherwise, let NestJS handle HttpExceptions automatically
      throw error;
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
  ): Promise<Response | void> {
    try {
      const user = await this.userService.findAll();
      if (user) {
        successResponse(res, 'Gell all user successfully', user);
      } else {
        errorResponse(res, 'There is no user');
      }
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }

      throw error;
    }
  }

  @GetApi({
    path: '/:id',
    summary: 'Get a user',
    responses: [
      { status: 200, description: 'Get a user successfully ' },
      { status: 404, description: 'Bad Request ' },
    ],
    param: { name: 'id', description: 'User ID' },
  })
  async findOne(
    @Param('id') id: string,
    @Req() req: Request,
    @Res()
    res: Response,
  ): Promise<Response | void> {
    try {
      const user = await this.userService.findOne(id);
      if (user) {
        successResponse(res, 'User created successfully', user);
      } else {
        errorResponse(res, 'User creation failed');
      }
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }

      throw error;
    }
  }

  @PatchApi({
    path: '/:id',
    summary: 'Update user',
    param: { name: 'id', description: 'User ID' },
    responses: [
      { status: 200, description: 'Update user successfully ' },
      { status: 404, description: 'Bad Request ' },
    ],
    body: {
      type: UpdateUserDto,
      description: 'Update user detail ',
    },
  })
  @UseGuards(RoleGuard)
  @Role('admin')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
    @Res()
    res: Response,
  ): Promise<Response | void> {
    try {
      const user = await this.userService.update(id, updateUserDto);
      if (user) {
        successResponse(res, 'User created successfully', user);
      } else {
        errorResponse(res, 'User creation failed');
      }
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }

      throw error;
    }
  }

  @DeleteApi({
    path: '/:id',
    summary: 'Delete user',
    responses: [
      { status: 200, description: 'Delete user successfully' },
      { status: 404, description: 'Bad Request ' },
    ],
    param: { name: 'id', description: 'User ID' },
  })
  @UseGuards(RoleGuard)
  @Role('admin')
  async remove(
    @Param('id') id: string,
    @Req() req: Request,
    @Res()
    res: Response,
  ): Promise<Response | void> {
    try {
      const user = await this.userService.remove(id);
      if (user) {
        successResponse(res, 'User created successfully', user);
      } else {
        errorResponse(res, 'User creation failed');
      }
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new BadRequestException((error as Error).message);
      }

      throw error;
    }
  }
}
