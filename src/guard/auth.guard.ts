import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ChecktokenMiddleware } from 'src/middleware /checkToken.middleware';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly nonSecurePaths = ['/auth/login', '/auth/register'];

  constructor(private readonly checkTokenService: ChecktokenMiddleware) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { url, headers } = request;

    // Allow requests to non-secure paths without a token
    if (this.nonSecurePaths.includes(url)) {
      return true;
    }

    const authorization = headers['authorization'];

    // Check if authorization header exists
    if (!authorization) {
      throw new UnauthorizedException('Authorization Failed');
    }

    // Validate the token
    const tokenValidation =
      await this.checkTokenService.validateUserToken(authorization);

    if (!tokenValidation.isValid) {
      throw new UnauthorizedException(
        tokenValidation.error || 'Token validation failed',
      );
    }

    // Attach user to request if validation succeeds
    request.user = tokenValidation.user;

    return true;
  }
}
