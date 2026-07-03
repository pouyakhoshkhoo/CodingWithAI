# Real Estate Verification Marketplace - Implementation Contract

This branch supersedes the earlier Go backend scaffold.

Mandatory stack:

- Backend: NestJS TypeScript
- Database: PostgreSQL with PostGIS
- ORM: Prisma
- Cache and queue: Redis with BullMQ
- Authentication: JWT access and refresh tokens
- OTP and SMS: Kavenegar REST API through a single notification service
- Storage: S3-compatible private object storage
- Frontend: Next.js TypeScript with TailwindCSS
- Maps: Leaflet, OpenStreetMap tile layer, and marker clustering
- Deployment: Docker and docker-compose for local development

Core business rules:

- One base listing per national ID, with paid incremental listings after the active free listing.
- Admin-only manual name and deed review.
- Listing approval requires positive admin identity/name match.
- Visitors can browse listings and maps without login.
- Owner phone reveal requires visitor OTP verification and successful contact-unlock payment.
- Listing duration is owner-selected and capped at 30 days.
- Hourly BullMQ job expires published listings after expiresAt.
- Published listing edits create pending edit requests and hide the live listing until admin decision.
- Reports enter an admin queue and can remove listings after review.
- Admin levels: super_admin, content_moderator, support.
- Admin actions must be audited.

Map contract:

- Visitor map calls GET /api/listings/map with swLat, swLng, neLat, neLng, zoom.
- Backend uses PostGIS geography Point 4326 and a GIST index.
- Query returns lightweight pin data: id, lat, lng, price, title, thumbnailUrl.
- Owner must pick location on a Leaflet map. No manual lat/lng text entry.

The full user-provided product specification is the source of truth for this branch.
