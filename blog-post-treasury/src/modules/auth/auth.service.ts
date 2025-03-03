import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto, SignInDto, SignUpDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto, res: Response) {
    try {
      const { password, ...userInfo } = signUpDto;
      let hashedPassword: string;

      try {
        const saltOrRounds = 10;
        hashedPassword = await bcrypt.hash(password, saltOrRounds);
      } catch (err) {
        throw new HttpException(
          'Error hashing password',
          HttpStatus.BAD_REQUEST,
        );
      }

      const newUser = await this.userService.create({
        ...userInfo,
        password: hashedPassword,
      });

      const { id, username } = newUser;
      const accessToken = this.generateAccessToken(id, username);
      const refreshToken = this.generateRefreshToken(id, username);

      await this.userService.update(id, { refresh_token: refreshToken });

      return res.json({
        accessToken,
        newUser,
        message: 'User Signup Successfully',
      });
    } catch (err) {
      return res.json({
        success: false,
        message: 'Internal server Error',
      });
    }
  }

  async signIn(signInDto: SignInDto, res: Response) {
    const { username, password } = signInDto;

    const user = await this.userService.findUserByUsername(username);
    console.log('user', user);

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const { id } = user;
    const accessToken = this.generateAccessToken(id, username);
    const refreshToken = this.generateRefreshToken(id, username);

    await this.userService.update(id, { refresh_token: refreshToken });

    const currentUser = await this.userService.findOne(user.id);
    return res.json({
      accessToken,
      refreshToken,
      currentUser,
      message: 'User Signin Successfully',
    });
  }

  async refreshAccessToken(body: RefreshTokenDto, res: Response) {
    const {userId, token} = body;
    if (!token) {
      throw new UnauthorizedException('Refresh token not found');
    }

    // const decoded = this.jwtService.verify(token, {
    //   secret: process.env.REFRESH_TOKEN_SECRET,
    // });
    // console.log('decoded', decoded);

    const user = await this.userService.findOne(userId);

    if (!user || user.refresh_token !== token) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const newAccessToken = this.generateAccessToken(user.id, user.username);
    const newRefreshToken = this.generateRefreshToken(user.id, user.username);

    console.log('newAccessToken', newAccessToken)
    console.log('newRefreshToken', newRefreshToken)

    await this.userService.update(userId, { refresh_token: newRefreshToken });

    return res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      message: 'Token Refreshed Successfully',
    });
  }

  private generateAccessToken(id: string, username: string): string {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
    const accessToken = this.jwtService.sign(
      { id, username },
      { secret: ACCESS_TOKEN_SECRET, expiresIn: '15m' },
    );
    return accessToken;
  }

  private generateRefreshToken(id: string, username: string): string {
    const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
    const refreshToken = this.jwtService.sign(
      { id, username },
      { secret: REFRESH_TOKEN_SECRET, expiresIn: '1d' },
    );
    return refreshToken;
  }
}
