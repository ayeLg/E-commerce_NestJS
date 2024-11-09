import { IsJWT } from 'class-validator';

export class JWTValidation {
  @IsJWT()
  token: string;
}
