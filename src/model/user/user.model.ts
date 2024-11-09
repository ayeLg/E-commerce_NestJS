import { getModelForClass } from '@typegoose/typegoose';

import { Document } from 'mongoose';
import Property from 'src/util/decorator/model/property.decorator';

enum Gender {
  UNKNOWN = 'UNKNOWN',
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

enum Type {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export class User extends Document {
  @Property({ required: true, type: String }, { example: 'John' })
  public firstName: string;

  @Property({ required: true, type: String }, { example: 'Doe' })
  public lastName: string;

  @Property(
    { required: true, type: String, unique: true },
    { example: 'john@example.com' },
  )
  public email: string;

  @Property({ required: true, type: String }, { example: 'password123' })
  public password: string;

  @Property(
    { required: true, type: String, nique: true },
    { example: '0923423423' },
  )
  public phone: string;

  @Property({ required: true, type: String, enum: Gender }, { example: Gender })
  public gender: Gender;

  @Property({ required: false, type: String, default: null })
  public token: string;

  @Property({ required: false, type: String, enum: Type, default: 'USER' })
  public type: Type;
}

export const UserModel = getModelForClass(User);
