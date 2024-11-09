import { Injectable, NestMiddleware } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import { ChecktokenMiddleware } from './checkToken.middleware';

@Injectable()
export class ApplicationMiddleware implements NestMiddleware {
  private readonly nonSecurePaths = ['/auth/login', '/auth/register'];

  constructor(private readonly checkTokenService: ChecktokenMiddleware) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (this.nonSecurePaths.includes(req.baseUrl)) {
      return next();
    }

    const authorization = req.headers['authorization'];

    if (!authorization) {
      return res.status(401).json({
        error: true,
        authorized: false,
        message: 'Authorization Failed',
      });
    }

    const tokenValidation =
      await this.checkTokenService.validateUserToken(authorization);

    if (!tokenValidation.isValid) {
      return res.status(401).json({
        error: true,
        authorized: false,
        message: tokenValidation.error || 'Token validation failed',
      });
    }
    // Optionally attach user to request for further use
    (req as any).user = tokenValidation.user;

    next();
  }
}
