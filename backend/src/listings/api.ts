import { Controller, Get } from '@nestjs/common';

@Controller('listings')
export class ListingsController {
  @Get()
  list() {
    return [];
  }
}
