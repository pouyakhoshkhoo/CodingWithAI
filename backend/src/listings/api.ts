import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ListingsService } from './listings.service';

@Controller('listings')
export class ListingsController {
  constructor(private readonly service: ListingsService) {}

  @Get()
  list() {
    return this.service.listPublished();
  }

  @Get('map')
  map(@Query() query: Record<string, string>) {
    return this.service.mapQuery(Number(query.swLat), Number(query.swLng), Number(query.neLat), Number(query.neLng));
  }

  @Get(':id')
  detail(@Param('id') id: string, @Query('viewerId') viewerId?: string) {
    return this.service.getDetail(id, viewerId);
  }

  @Post()
  create(@Body() body: Record<string, unknown>) {
    return this.service.createDraft(body as never);
  }
}
