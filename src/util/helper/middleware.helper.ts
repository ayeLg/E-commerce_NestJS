import { JwtPayload } from 'jsonwebtoken';
import { JWTHelper } from './jwt.helper';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import * as moment from 'moment';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { JWTValidation } from '../gloabl_validation/jwtvalidation';

@Injectable()
export class MiddlewareHelper {
  private readonly logger = new Logger(MiddlewareHelper.name);

  constructor(@Inject(JWTHelper) private jwtHelper: JWTHelper) {}

  public async validateToken(authorization: string): Promise<{
    isValid: boolean;
    payload?: JwtPayload;
    error?: string;
  }> {
    try {
      // Check if Authorization header exists
      if (!authorization) {
        return {
          isValid: false,
          error: 'No authorization token provided',
        };
      }
      // Bearer undefined
      const bearer = authorization.split(' ')[1] ?? null;

      if (!bearer) {
        return {
          isValid: false,
          error: 'Invalid token format',
        };
      }

      // convert jwt token plain to class for validation
      const jwt = plainToClass(JWTValidation, {
        token: bearer,
      });

      const validationErrors = await validate(jwt);
      // check validation
      if (validationErrors.length > 0) {
        this.logger.warn('Token validation failed', validationErrors);
        return {
          isValid: false,
          error: 'Invalid token structure',
        };
      }

      // decode
      const decode = this.jwtHelper.verifyToken(bearer) as JwtPayload;

      // there is no decode value
      if (!decode) {
        return {
          isValid: false,
          error: 'Token verification failed',
        };
      }

      // check expiry
      const exp = moment.unix(decode['exp']!).format('yyyy-MM-DD hh:mm:ss');

      const now = moment().format('yyyy-MM-DD hh:mm:ss');

      //check expired date
      if (now > exp) {
        return {
          isValid: false,
          error: 'Token has expired',
        };
      }

      // insert token to decode data
      decode['token'] = bearer;

      // final return deocode value
      return {
        isValid: true,
        payload: decode,
      };
    } catch (error) {
      this.logger.error('Token validation error', error);
      return {
        isValid: false,
        error: error.message,
      };
    }
  }
}
