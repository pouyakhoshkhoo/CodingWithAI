CREATE EXTENSION IF NOT EXISTS postgis;

ALTER TABLE "Listing"
ADD COLUMN IF NOT EXISTS location geography(Point, 4326);

UPDATE "Listing"
SET location = ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
WHERE location IS NULL;

CREATE OR REPLACE FUNCTION sync_listing_location()
RETURNS trigger AS $$
BEGIN
  NEW.location = ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326)::geography;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_listing_location ON "Listing";
CREATE TRIGGER trg_sync_listing_location
BEFORE INSERT OR UPDATE OF lat, lng ON "Listing"
FOR EACH ROW
EXECUTE FUNCTION sync_listing_location();

CREATE INDEX IF NOT EXISTS idx_listing_location_gist ON "Listing" USING GIST (location);
