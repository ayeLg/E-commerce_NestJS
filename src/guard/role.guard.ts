import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User, UserModel } from 'src/model/user/user.model'; // Adjust the import based on your project structure
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectModel(UserModel.modelName) private userModel: Model<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRole = this.reflector.get<string>(
      'role',
      context.getHandler(),
    );

    if (!requiredRole) {
      return true; // If no role is defined, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assume user is attached to the request after token validation

    if (!user || !user.id) {
      throw new ForbiddenException('User  not found');
    }

    // Fetch user data from the database using the user ID
    const foundUser = await this.userModel.findById(user.id).exec();

    if (!foundUser) {
      throw new ForbiddenException('User  not found');
    }

    // Check if the user's type matches the required role
    const hasRole = foundUser.type === requiredRole; // Assuming 'type' is the field that stores the user's role
    if (!hasRole) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
