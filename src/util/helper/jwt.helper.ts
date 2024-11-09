import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JWTHelper {
  public generateToken(data: string | object): string {
    const jwtSecretKey = process.env.JWT_SECRET_KEY as jwt.Secret;

    const token = jwt.sign(data, jwtSecretKey, { expiresIn: '30d' });

    return token;
  }

  public verifyToken(token: string): string | jwt.JwtPayload {
    const jwtSecretKey = process.env.JWT_SECRET_KEY as jwt.Secret;
    const decode = jwt.verify(token, jwtSecretKey);

    return decode;
  }
}
