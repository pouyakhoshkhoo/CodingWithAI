CREATE TABLE users (
  id UUID PRIMARY KEY,
  mobile VARCHAR(32) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  national_id_hash VARCHAR(128),
  identity_status VARCHAR(32) NOT NULL DEFAULT 'pending_review',
  risk_status VARCHAR(32) NOT NULL DEFAULT 'normal',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE identity_documents (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  file_key TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'pending_review',
  admin_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE property_documents (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  deed_number_hash VARCHAR(128),
  owner_name VARCHAR(255),
  owner_national_id_hash VARCHAR(128),
  property_address TEXT,
  file_key TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'pending_review',
  admin_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE listings (
  id UUID PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES users(id),
  property_document_id UUID REFERENCES property_documents(id),
  type VARCHAR(32) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  city VARCHAR(128) NOT NULL,
  neighborhood VARCHAR(128),
  area INTEGER NOT NULL,
  rooms INTEGER,
  price BIGINT,
  deposit BIGINT,
  monthly_rent BIGINT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  status VARCHAR(32) NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ
);

CREATE TABLE admin_decisions (
  id UUID PRIMARY KEY,
  admin_id UUID,
  target_type VARCHAR(64) NOT NULL,
  target_id UUID NOT NULL,
  decision VARCHAR(32) NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE fraud_signals (
  id UUID PRIMARY KEY,
  listing_id UUID REFERENCES listings(id),
  user_id UUID REFERENCES users(id),
  signal VARCHAR(128) NOT NULL,
  severity VARCHAR(32) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_listings_public_filter ON listings(status, city, neighborhood, type, price, area);
CREATE INDEX idx_users_risk_status ON users(risk_status);
CREATE INDEX idx_property_documents_deed_hash ON property_documents(deed_number_hash);
