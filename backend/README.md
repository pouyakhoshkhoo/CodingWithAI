# Backend - Verified Property Marketplace

Go backend for a manual-first trusted real-estate marketplace.

## Run

```bash
go run ./cmd/api
```

API runs on `:8080` by default.

## Current MVP

- OTP request/verify skeleton
- User identity status model
- Listing submission
- Manual admin review queue
- Manual approve/reject/needs-more-info/block decisions
- Basic price/location risk flags
- Public published-listings endpoint
- Audit trail in code structure

## Important Product Rule

Verification is manual-first. AI/OCR must not approve or reject listings in the MVP. Future AI modules may only assist admins by extracting fields, detecting mismatches, and suggesting risk flags.

## Main Endpoints

- `GET /health`
- `POST /api/v1/auth/otp/request`
- `POST /api/v1/auth/otp/verify`
- `POST /api/v1/listings`
- `GET /api/v1/listings`
- `GET /api/v1/admin/review-queue`
- `POST /api/v1/admin/listings/{id}/review`

## Next Production Steps

- Replace in-memory store with PostgreSQL repositories
- Add Redis-backed OTP and rate limiting
- Add private S3-compatible object storage for کارت ملی and سند رسمی
- Add JWT signing and RBAC middleware
- Add malware scanning and file validation
- Add audit-log persistence
- Add official registry integration adapter later if available
