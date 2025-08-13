-- Donations (matches) table
CREATE TABLE IF NOT EXISTS donations (
	id SERIAL PRIMARY KEY,
	listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
	donor_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	proposed_by_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	status VARCHAR(20) NOT NULL CHECK (status IN ('proposed','accepted','delivered')) DEFAULT 'proposed',
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	accepted_at TIMESTAMP,
	delivered_at TIMESTAMP,
	CONSTRAINT donations_distinct UNIQUE (listing_id, donor_id, receiver_id),
	CONSTRAINT donor_receiver_diff CHECK (donor_id <> receiver_id)
);

CREATE INDEX IF NOT EXISTS idx_donations_listing ON donations(listing_id);
CREATE INDEX IF NOT EXISTS idx_donations_donor ON donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_receiver ON donations(receiver_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
