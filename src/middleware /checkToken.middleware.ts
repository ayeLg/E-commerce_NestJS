import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserModel } from 'src/model/user/user.model';
import { MiddlewareHelper } from 'src/util/helper/middleware.helper';

@Injectable()
export class ChecktokenMiddleware {
  private readonly logger = new Logger(ChecktokenMiddleware.name);
  constructor(
    @Inject(MiddlewareHelper) private middlewareHelper: MiddlewareHelper,
    @InjectModel(UserModel.modelName) private userModel: Model<User>,
  ) {}

  public async validateUserToken(authorization: string): Promise<{
    isValid: boolean;
    user?: User;
    error?: string;
  }> {
    try {
      // check expired before retrieve user information from database
      const tokenValidation =
        await this.middlewareHelper.validateToken(authorization);
      if (!tokenValidation.isValid || !tokenValidation.payload) {
        return {
          isValid: false,
          error: tokenValidation.error,
        };
      }

      // Extract user information from token
      const { user_id, userType, token } = tokenValidation.payload;

      // Find user in database
      const user = await this.userModel.findOne({
        _id: user_id,
        type: userType,
        token: token,
      });

      if (!user) {
        this.logger.warn(`User not found or token mismatch: ${user_id}`);
        return {
          isValid: false,
          error: 'User not found or invalid token',
        };
      }

      return {
        isValid: true,
        user,
      };
    } catch (error) {
      this.logger.error('User token validation error', error);
      return {
        isValid: false,
        error: error.message,
      };
    }
  }
}
