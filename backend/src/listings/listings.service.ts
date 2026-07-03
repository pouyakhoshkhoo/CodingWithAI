import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

type Listing = {
  id: string;
  ownerId: string;
  ownerPhone: string;
  title: string;
  description: string;
  price: string;
  address: string;
  lat: number;
  lng: number;
  status: string;
  durationDays: number;
  publishedAt?: string;
  expiresAt?: string;
  thumbnailUrl?: string;
};

@Injectable()
export class ListingsService {
  private readonly listings = new Map<string, Listing>();
  private readonly unlocks = new Set<string>();

  createDraft(body: Partial<Listing>) {
    if (!body.durationDays || body.durationDays > 30) throw new BadRequestException('durationDays must be 30 or less');
    if (typeof body.lat !== 'number' || typeof body.lng !== 'number') throw new BadRequestException('Location must be selected on the map');
    const listing: Listing = {
      id: crypto.randomUUID(),
      ownerId: body.ownerId ?? 'local-owner',
      ownerPhone: body.ownerPhone ?? '09000000000',
      title: body.title ?? '',
      description: body.description ?? '',
      price: body.price ?? '0',
      address: body.address ?? '',
      lat: body.lat,
      lng: body.lng,
      status: 'pending_review',
      durationDays: body.durationDays,
      thumbnailUrl: body.thumbnailUrl
    };
    this.listings.set(listing.id, listing);
    return listing;
  }

  listPublished() {
    return [...this.listings.values()].filter((item) => item.status === 'published');
  }

  mapQuery(swLat: number, swLng: number, neLat: number, neLng: number) {
    return this.listPublished()
      .filter((item) => item.lat >= swLat && item.lat <= neLat && item.lng >= swLng && item.lng <= neLng)
      .map(({ id, lat, lng, price, title, thumbnailUrl }) => ({ id, lat, lng, price, title, thumbnailUrl }));
  }

  getDetail(id: string, viewerId?: string) {
    const listing = this.getRequired(id);
    const unlocked = viewerId ? this.unlocks.has(`${viewerId}:${id}`) : false;
    const { ownerPhone, ...safe } = listing;
    return unlocked ? { ...safe, ownerPhone } : safe;
  }

  revealContact(id: string, userId: string, paid: boolean) {
    if (!paid) throw new BadRequestException('Contact unlock payment is required');
    const listing = this.getRequired(id);
    this.unlocks.add(`${userId}:${id}`);
    return { phone: listing.ownerPhone };
  }

  approve(id: string, match: boolean) {
    if (!match) throw new BadRequestException('Listing cannot be approved without a positive manual match');
    const listing = this.getRequired(id);
    const now = new Date();
    listing.status = 'published';
    listing.publishedAt = now.toISOString();
    listing.expiresAt = new Date(now.getTime() + listing.durationDays * 86400000).toISOString();
    return listing;
  }

  reject(id: string) {
    const listing = this.getRequired(id);
    listing.status = 'rejected';
    return listing;
  }

  pending() {
    return [...this.listings.values()].filter((item) => item.status === 'pending_review');
  }

  expirePublished(now = new Date()) {
    let expired = 0;
    for (const listing of this.listings.values()) {
      if (listing.status === 'published' && listing.expiresAt && new Date(listing.expiresAt) < now) {
        listing.status = 'expired';
        expired++;
      }
    }
    return { expired };
  }

  private getRequired(id: string) {
    const listing = this.listings.get(id);
    if (!listing) throw new NotFoundException('Listing not found');
    return listing;
  }
}
