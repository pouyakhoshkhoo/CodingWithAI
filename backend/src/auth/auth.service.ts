import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NotificationService } from '../notifications/notification.service';
import { isIranianMobile } from '../core/iran';

@Injectable()
export class AuthService {
  private readonly otpByPhone = new Map<string, { code: string; expiresAt: number; count: number; windowStart: number }>();

  constructor(
    private readonly jwt: JwtService,
    private readonly notifications: NotificationService
  ) {}

  async requestOtp(phone: string, purpose: string) {
    if (!isIranianMobile(phone)) throw new BadRequestException('Invalid Iranian mobile number');
    const now = Date.now();
    const current = this.otpByPhone.get(phone);
    if (current && now - current.windowStart < 10 * 60 * 1000 && current.count >= 3) {
      throw new BadRequestException('OTP request limit exceeded');
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    this.otpByPhone.set(phone, {
      code,
      expiresAt: now + 2 * 60 * 1000,
      count: current && now - current.windowStart < 10 * 60 * 1000 ? current.count + 1 : 1,
      windowStart: current && now - current.windowStart < 10 * 60 * 1000 ? current.windowStart : now
    });
    await this.notifications.sendOtp(phone, code);
    return { ok: true, purpose };
  }

  async verifyOtp(phone: string, code: string) {
    const record = this.otpByPhone.get(phone);
    if (!record || record.code !== code || record.expiresAt < Date.now()) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    this.otpByPhone.delete(phone);
    const payload = { sub: phone, phone, role: 'visitor' };
    return {
      accessToken: await this.jwt.signAsync(payload, { secret: process.env.JWT_ACCESS_SECRET ?? 'local-access-secret', expiresIn: '15m' }),
      refreshToken: await this.jwt.signAsync(payload, { secret: process.env.JWT_REFRESH_SECRET ?? 'local-refresh-secret', expiresIn: '30d' })
    };
  }
}
