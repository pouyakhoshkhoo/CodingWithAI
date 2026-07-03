import { Body, Controller, Post } from '@nestjs/common';

@Controller('payments')
export class PaymentsController {
  @Post('initiate')
  initiate(@Body() body: { type: string; listingId?: string }) {
    return { status: 'pending', type: body.type, listingId: body.listingId, redirectUrl: '/mock-payment' };
  }

  @Post('callback')
  callback(@Body() body: Record<string, unknown>) {
    return { status: 'success', gatewayRef: body.gatewayRef ?? 'local-gateway' };
  }
}
