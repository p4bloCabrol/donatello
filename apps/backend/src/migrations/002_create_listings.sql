CREATE TABLE IF NOT EXISTS listings (
  id SERIAL PRIMARY KEY,
  author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('offer', 'need')),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  quantity INTEGER,
  location VARCHAR(200),
  photos TEXT[],
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
