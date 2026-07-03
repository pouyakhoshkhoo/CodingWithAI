import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ListingsService } from '../listings/listings.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly listings: ListingsService) {}

  @Get('listings/pending')
  pendingListings() {
    return this.listings.pending();
  }

  @Post('listings/:id/approve')
  approveListing(@Param('id') id: string, @Body() body: { nationalIdMatch: boolean }) {
    return this.listings.approve(id, body.nationalIdMatch);
  }

  @Post('listings/:id/reject')
  rejectListing(@Param('id') id: string) {
    return this.listings.reject(id);
  }
}
