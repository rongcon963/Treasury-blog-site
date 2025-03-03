import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenDto, SignInDto, SignUpDto } from './dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto, @Res() res: Response) {
    try {
      await this.authService.signUp(signUpDto, res);
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    try {
      await this.authService.signIn(signInDto, res);
    } catch (error) {
      return res.json({
        message: error.message,
      });
    }
  }

  @Post('refresh-token')
  async refreshAccessToken(@Body() body: RefreshTokenDto, @Res() res: Response) {
    try {
      const getTokenData = await this.authService.refreshAccessToken(body, res);
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
