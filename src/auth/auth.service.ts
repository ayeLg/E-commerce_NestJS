import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserModel } from 'src/model/user/user.model';
import { LoginDTO, RegisterDTO } from './dto/auth.dto';
import passwordHashing from 'src/util/helper/password.hashing';
import { JWTHelper } from 'src/util/helper/jwt.helper';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel.modelName) private userModel: Model<User>,
    private readonly jwtHelper: JWTHelper,
  ) {}

  async registerService(authDto: RegisterDTO): Promise<User> {
    try {
      // Check if user already exists
      const existingUser = await this.userModel.findOne({
        email: authDto.email,
      });

      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      // Hash password
      const hashedPassword = await passwordHashing.hashPassword(
        authDto.password,
      );

      // Create user
      const user = await this.userModel.create({
        ...authDto,
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
      throw new Error((error as Error).message);
    }
  }

  async loginService(loginDto: LoginDTO): Promise<User | null> {
    try {
      const { email, password } = loginDto;

      // Find user
      const user = await this.userModel.findOne({ email }).select('+password');

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      // Verify password
      const isPasswordValid = await passwordHashing.comparePassword(
        password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
      // Generate token
      const token = this.jwtHelper.generateToken({
        user_id: user._id,
        userType: user.type,
      });

      // Update user with new token
      user.token = token;
      await user.save();
      // Remove sensitive data
      user.password = undefined;
      return user;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('No user found with this email');
    }

    // Generate reset token
    // const resetToken = this.generateResetToken();

    // Save reset token and expiry
    // user.resetPasswordToken = resetToken;
    // user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // Send email with reset link
    // await this.sendResetPasswordEmail(email, resetToken);
  }

  private generateResetToken(): string {
    return 'Hello';
    // return crypto.randomBytes(32).toString('hex');
  }

  private async sendResetPasswordEmail(
    email: string,
    token: string,
  ): Promise<void> {
    console.log(email, token);

    // Implement email sending logic
    // Use a service like SendGrid, Nodemailer, etc.
  }
}
