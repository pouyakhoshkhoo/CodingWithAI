import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  async sendOtp(phone: string, code: string): Promise<void> {
    console.log(`OTP for ${phone}: ${code}`);
  }

  async sendListingStatusChange(phone: string, listingId: string, status: string): Promise<void> {
    console.log(`Listing ${listingId} for ${phone}: ${status}`);
  }

  async sendEditRequestResult(phone: string, approved: boolean): Promise<void> {
    console.log(`Edit request for ${phone}: ${approved ? 'approved' : 'rejected'}`);
  }
}
