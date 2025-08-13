import express from 'express';
import db from '../db.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

// List donations relevant to current user
router.get('/', authenticateJWT, async (req, res) => {
	const userId = req.user.id;
	const { rows } = await db.query(
		`SELECT d.*, l.title, l.type
			 FROM donations d
			 JOIN listings l ON l.id = d.listing_id
			WHERE d.donor_id = $1 OR d.receiver_id = $1
			ORDER BY d.created_at DESC`,
		[userId]
	);
	res.json(rows);
});

// Accept a donation (only receiver can accept)
router.patch('/:id/accept', authenticateJWT, async (req, res) => {
	const id = Number(req.params.id);
	const userId = req.user.id;
	const { rows } = await db.query('SELECT * FROM donations WHERE id=$1', [id]);
	const d = rows[0];
	if (!d) return res.status(404).json({ error: 'No encontrada' });
	if (d.receiver_id !== userId) return res.status(403).json({ error: 'No autorizado' });
	if (d.status !== 'proposed') return res.status(400).json({ error: 'Estado inválido' });
	const upd = await db.query(
		`UPDATE donations SET status='accepted', accepted_at=NOW() WHERE id=$1 RETURNING *`,
		[id]
	);
	res.json(upd.rows[0]);
});

// Confirm delivery (only donor can confirm delivered)
router.patch('/:id/deliver', authenticateJWT, async (req, res) => {
	const id = Number(req.params.id);
	const userId = req.user.id;
	const { rows } = await db.query('SELECT * FROM donations WHERE id=$1', [id]);
	const d = rows[0];
	if (!d) return res.status(404).json({ error: 'No encontrada' });
	if (d.donor_id !== userId) return res.status(403).json({ error: 'No autorizado' });
	if (d.status !== 'accepted') return res.status(400).json({ error: 'Estado inválido' });
	const upd = await db.query(
		`UPDATE donations SET status='delivered', delivered_at=NOW() WHERE id=$1 RETURNING *`,
		[id]
	);
	res.json(upd.rows[0]);
});

export default router;
