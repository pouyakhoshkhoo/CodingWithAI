import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Get('health')
  health() {
    return { ok: true };
  }

  @Post('otp/request')
  requestCode(@Body() body: { phone: string; purpose: string }) {
    return this.auth.requestOtp(body.phone, body.purpose);
  }
}
