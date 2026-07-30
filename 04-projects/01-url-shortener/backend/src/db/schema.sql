-- URL Shortener schema (Postgres)
CREATE TABLE IF NOT EXISTS urls (
  id BIGSERIAL PRIMARY KEY,
  short_id VARCHAR(10) UNIQUE NOT NULL,
  long_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  click_count BIGINT NOT NULL DEFAULT 0,
  user_id VARCHAR(64) -- nullable, for future auth
);

CREATE INDEX IF NOT EXISTS idx_short_id ON urls(short_id);
CREATE INDEX IF NOT EXISTS idx_created_at ON urls(created_at DESC);

-- Analytics: per-click log
CREATE TABLE IF NOT EXISTS clicks (
  id BIGSERIAL PRIMARY KEY,
  short_id VARCHAR(10) NOT NULL REFERENCES urls(short_id),
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_agent TEXT,
  referer TEXT,
  country CHAR(2)
);

CREATE INDEX IF NOT EXISTS idx_clicks_short_id ON clicks(short_id);