# Hosting and Running Guide

This repository contains two separate projects:

- `backend/` - Go API service
- `frontend/` - Next.js TypeScript web application

The current version is an MVP scaffold. The backend uses an in-memory store for fast local development, while the SQL migration describes the production PostgreSQL schema.

## 1. Local Development

### Requirements

Install:

- Docker and Docker Compose
- Go 1.23 or newer
- Node.js 20 or newer
- npm, pnpm, or yarn

### Start infrastructure

From the repository root:

```bash
docker compose up -d
```

This starts:

- PostgreSQL on `localhost:5432`
- Redis on `localhost:6379`

### Run backend

```bash
cd backend
go mod tidy
go run ./cmd/api
```

Backend will run on:

```text
http://localhost:8080
```

Health check:

```bash
curl http://localhost:8080/health
```

### Run frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```text
http://localhost:3000
```

## 2. Fix Next.js Workspace Root / Turbopack Issues

If Next.js prints a warning about multiple lockfiles or fails with a missing `@swc/helpers...` module, clean the local install and run the frontend from the `frontend` directory only.

From the repository root on Windows PowerShell:

```powershell
Remove-Item -Recurse -Force .\frontend\.next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .\frontend\node_modules -ErrorAction SilentlyContinue
Remove-Item -Force .\package-lock.json -ErrorAction SilentlyContinue
cd .\frontend
npm install
npm run dev
```

From Linux/macOS/Git Bash:

```bash
rm -rf frontend/.next frontend/node_modules
rm -f package-lock.json
cd frontend
npm install
npm run dev
```

The frontend contains `next.config.ts` with an explicit Turbopack root so Next.js treats `frontend/` as the application root.

## 3. Local API Smoke Test

Request OTP placeholder:

```bash
curl -X POST http://localhost:8080/api/v1/auth/otp/request \
  -H 'Content-Type: application/json' \
  -d '{"mobile":"09120000000"}'
```

Verify OTP placeholder and create a local user:

```bash
curl -X POST http://localhost:8080/api/v1/auth/otp/verify \
  -H 'Content-Type: application/json' \
  -d '{"mobile":"09120000000","fullName":"Test Owner","nationalId":"1234567890"}'
```

Create listing. Replace `OWNER_ID` with the user id returned above:

```bash
curl -X POST http://localhost:8080/api/v1/listings \
  -H 'Content-Type: application/json' \
  -d '{
    "ownerId":"OWNER_ID",
    "type":"sale",
    "title":"85m verified apartment",
    "description":"Manual review test listing",
    "city":"Tehran",
    "neighborhood":"Saadat Abad",
    "area":85,
    "rooms":2,
    "price":12000000000,
    "lat":35.7219,
    "lng":51.3347
  }'
```

View admin review queue:

```bash
curl http://localhost:8080/api/v1/admin/review-queue
```

Approve listing. Replace `LISTING_ID` with the listing id:

```bash
curl -X POST http://localhost:8080/api/v1/admin/listings/LISTING_ID/review \
  -H 'Content-Type: application/json' \
  -d '{"decision":"approve","reason":"Manual documents and price review passed","adminId":"local-admin"}'
```

View public listings:

```bash
curl http://localhost:8080/api/v1/listings
```

## 4. Recommended MVP Hosting

For the fastest MVP hosting:

- Frontend: Vercel, Netlify, or any Node-compatible host
- Backend: Fly.io, Render, Railway, Docker VPS, or Kubernetes
- Database: Managed PostgreSQL
- Cache/OTP: Managed Redis
- File storage: S3-compatible private object storage

## 5. Simple VPS Hosting with Docker

A simple production-like deployment can run on one VPS using Docker Compose.

Recommended services:

- `frontend` container exposing port `3000`
- `backend` container exposing port `8080`
- `postgres` container or managed PostgreSQL
- `redis` container or managed Redis
- Nginx or Caddy as reverse proxy

Example domain routing:

```text
https://example.com        -> frontend:3000
https://api.example.com    -> backend:8080
```

## 6. Frontend Production Build

```bash
cd frontend
npm install
npm run build
npm run start
```

## 7. Backend Production Build

```bash
cd backend
go mod tidy
go build -o verified-property-api ./cmd/api
HTTP_ADDR=:8080 ./verified-property-api
```

## 8. Environment Variables to Add Next

The current MVP does not yet consume all of these, but production implementation should use them:

```text
HTTP_ADDR=:8080
DATABASE_URL=postgres://user:password@host:5432/property_marketplace
REDIS_ADDR=host:6379
JWT_SECRET=replace-with-secure-secret
CORS_ALLOWED_ORIGINS=https://example.com
OBJECT_STORAGE_ENDPOINT=https://storage.example.com
OBJECT_STORAGE_BUCKET=property-documents
OBJECT_STORAGE_ACCESS_KEY=replace-with-secure-value
OBJECT_STORAGE_SECRET_KEY=replace-with-secure-value
```

Do not commit real secrets into GitHub.

## 9. Production Hardening Checklist

Before real users upload sensitive documents, implement:

1. PostgreSQL repository layer instead of in-memory store.
2. Redis-backed OTP and rate limiting.
3. JWT authentication and role-based access control.
4. Private object storage with signed URLs.
5. Malware and file-type validation for uploads.
6. Persistent audit logs for every admin action.
7. Admin access logs for every sensitive document view.
8. HTTPS-only deployment.
9. Strict CORS configuration.
10. Backup and restore process for PostgreSQL.
11. Manual-first verification workflow with future AI assistant only.

## 10. OpenStreetMap Notes

The frontend uses Leaflet and OpenStreetMap tiles. For production traffic, review tile usage policy and consider a paid tile provider or your own tile server if traffic becomes high.
