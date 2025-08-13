import express from 'express';
import db from '../db.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *   put:
 *     summary: Actualizar perfil del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil actualizado
 */
router.get('/me', authenticateJWT, async (req, res) => {
  const userId = req.user.id;
  const result = await db.query('SELECT id, name, email, role, created_at FROM users WHERE id = $1', [userId]);
  res.json(result.rows[0]);
});

router.put('/me', authenticateJWT, async (req, res) => {
  const userId = req.user.id;
  const { name, role } = req.body;
  if (!name && !role) return res.status(400).json({ error: 'Nada para actualizar' });
  const fields = [];
  const values = [];
  if (name) { fields.push('name'); values.push(name); }
  if (role) { fields.push('role'); values.push(role); }
  if (fields.length === 0) return res.status(400).json({ error: 'Nada para actualizar' });
  const set = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
  values.push(userId);
  const result = await db.query(`UPDATE users SET ${set} WHERE id = $${values.length} RETURNING id, name, email, role, created_at`, values);
  res.json(result.rows[0]);
});

export default router;
