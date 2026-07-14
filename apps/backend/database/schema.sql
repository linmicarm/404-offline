CREATE TABLE IF NOT EXISTS spawn_points (
  id                  SERIAL PRIMARY KEY,
  name                VARCHAR(255) NOT NULL,
  category            VARCHAR(100) NOT NULL,
  neighborhood        VARCHAR(100) NOT NULL,
  address             VARCHAR(255) NOT NULL,
  is_marta_accessible BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS side_quests (
  id                   SERIAL PRIMARY KEY,
  spawn_point_id       INTEGER NOT NULL REFERENCES spawn_points(id) ON DELETE CASCADE,
  name                 VARCHAR(255) NOT NULL,
  description          TEXT NOT NULL,
  date                 VARCHAR(50) NOT NULL,
  time                 VARCHAR(50) NOT NULL,
  cost                 NUMERIC(10, 2),
  is_free              BOOLEAN DEFAULT TRUE,
  is_beginner_friendly BOOLEAN DEFAULT FALSE,
  category             VARCHAR(100) NOT NULL,
  tags                 TEXT,
  going_count          INTEGER DEFAULT 0,
  created_at           TIMESTAMP DEFAULT NOW()
);