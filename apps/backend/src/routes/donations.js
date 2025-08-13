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

// Delete a donation (only receiver or donor can delete)
router.delete('/:id', authenticateJWT, async (req, res) => {
	const id = Number(req.params.id);
	const userId = req.user.id;
	const { rows } = await db.query('SELECT * FROM donations WHERE id=$1', [id]);
	const d = rows[0];
	if (!d) return res.status(404).json({ error: 'No encontrada' });
	if (d.receiver_id !== userId && d.donor_id !== userId) {
		return res.status(403).json({ error: 'No autorizado' });
	}
	await db.query('DELETE FROM donations WHERE id=$1', [id]);
	res.status(204).send();
});

/**
 * @swagger
 * /donations:
 *   get:
 *     summary: Listar donaciones relevantes para el usuario actual
 *     description: Devuelve una lista de donaciones donde el usuario actual es receptor o donante.
 *     tags:
 *       - Donations
 *     responses:
 *       200:
 *         description: Lista de donaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   type:
 *                     type: string
 *                   donor_id:
 *                     type: integer
 *                   receiver_id:
 *                     type: integer
 *                   status:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 */

/**
 * @swagger
 * /donations/{id}/accept:
 *   patch:
 *     summary: Aceptar una donación
 *     description: Permite al receptor aceptar una donación propuesta.
 *     tags:
 *       - Donations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la donación a aceptar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Donación aceptada exitosamente
 *       403:
 *         description: No autorizado para aceptar esta donación
 *       404:
 *         description: Donación no encontrada
 *       400:
 *         description: Estado inválido para aceptar
 */

/**
 * @swagger
 * /donations/{id}/deliver:
 *   patch:
 *     summary: Confirmar entrega de una donación
 *     description: Permite al donante confirmar que la donación fue entregada.
 *     tags:
 *       - Donations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la donación a confirmar como entregada
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Donación marcada como entregada exitosamente
 *       403:
 *         description: No autorizado para confirmar esta donación
 *       404:
 *         description: Donación no encontrada
 *       400:
 *         description: Estado inválido para confirmar
 */

/**
 * @swagger
 * /donations/{id}:
 *   delete:
 *     summary: Eliminar una donación
 *     description: Permite al receptor o donante eliminar una donación específica.
 *     tags:
 *       - Donations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la donación a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Donación eliminada exitosamente
 *       403:
 *         description: No autorizado para eliminar esta donación
 *       404:
 *         description: Donación no encontrada
 */

export default router;
