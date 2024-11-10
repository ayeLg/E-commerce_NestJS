import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModel } from 'src/model/user/user.model';
import { Model } from 'mongoose';
import passwordHashing from 'src/util/helper/password.hashing';
import { JWTHelper } from 'src/util/helper/jwt.helper';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel.modelName) private userModel: Model<User>,
    private readonly jwtHelper: JWTHelper,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Check if user already exists
      const existingUser = await this.userModel.findOne({
        email: createUserDto.email,
      });

      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      // Hash password
      const hashedPassword = await passwordHashing.hashPassword(
        createUserDto.password,
      );

      const user = await this.userModel.create({
        ...createUserDto,
        password: hashedPassword,
      });

      const token = this.jwtHelper.generateToken({
        user_id: user._id,
        userType: user.type,
      });

      user.token = token;
      await user.save();
      // Remove sensitive data
      user.password = undefined;

      return user;
    } catch (error) {
      console.log((error as Error).message);

      // Re-throw the original error if it's already an HttpException
      if (error instanceof HttpException) {
        throw error;
      }

      // Wrap other errors in a custom or generic HttpException
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async findAll(): Promise<User[] | null> {
    try {
      const user = await this.userModel.find();
      return user;
    } catch (error) {
      console.log((error as Error).message);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async findOne(id: string): Promise<User | null> {
    try {
      const user = await this.userModel.findById(id);
      return user;
    } catch (error) {
      console.log((error as Error).message);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    try {
      const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
        returnDocument: 'after',
      });
      console.log('user is ', user);

      return user;
    } catch (error) {
      console.log((error as Error).message);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async remove(id: string): Promise<User | null> {
    try {
      const user = await this.userModel.findByIdAndUpdate(
        id,
        {
          deleteStatus: 1,
        },
        { returnDocument: 'after' },
      );
      return user;
    } catch (error) {
      console.log((error as Error).message);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }
}
