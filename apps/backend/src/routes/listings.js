
import express from 'express';
import db from '../db.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /listings/{id}/applicants:
 *   get:
 *     summary: Obtener postulantes a una publicación
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la publicación
 *     responses:
 *       200:
 *         description: Lista de postulantes (donaciones en estado 'proposed')
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   receiver_id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   status:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Publicación no encontrada
 */
// Obtener postulantes a una publicación (donaciones en estado 'proposed')
router.get('/:id/applicants', authenticateJWT, async (req, res) => {
  const listingId = Number(req.params.id);
  const userId = req.user.id;
  // Solo el autor puede ver los postulantes
  const lres = await db.query('SELECT * FROM listings WHERE id = $1', [listingId]);
  const listing = lres.rows[0];
  if (!listing) return res.status(404).json({ error: 'Publicación no encontrada' });
  if (listing.author_id !== userId) return res.status(403).json({ error: 'No autorizado' });
  // Buscar postulantes
  const { rows } = await db.query(
    `SELECT d.*, u.name, u.email FROM donations d
     JOIN users u ON u.id = d.receiver_id
     WHERE d.listing_id = $1 AND d.status = 'proposed'
     ORDER BY d.created_at ASC`,
    [listingId]
  );
  res.json(rows);
});


/**
 * @swagger
 * tags:
 *   name: Listings
 *   description: CRUD de publicaciones
 */

/**
 * @swagger
 * /listings:
 *   get:
 *     summary: Listar publicaciones
 *     tags: [Listings]
 *     responses:
 *       200:
 *         description: Lista de publicaciones
 */
/**
 * @swagger
 * /listings:
 *   get:
 *     summary: Listar publicaciones (con filtros)
 *     tags: [Listings]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [offer, need]
 *         description: Filtrar por tipo
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrar por categoría
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filtrar por ubicación
 *     responses:
 *       200:
 *         description: Lista de publicaciones
 */
router.get('/', async (req, res) => {
  const { type, category, location } = req.query;
  let query = 'SELECT * FROM listings';
  const filters = [];
  const values = [];
  if (type) { filters.push(`type = $${filters.length + 1}`); values.push(type); }
  if (category) { filters.push(`category ILIKE $${filters.length + 1}`); values.push(`%${category}%`); }
  if (location) { filters.push(`location ILIKE $${filters.length + 1}`); values.push(`%${location}%`); }
  if (filters.length) query += ' WHERE ' + filters.join(' AND ');
  query += ' ORDER BY created_at DESC';
  const result = await db.query(query, values);
  res.json(result.rows);
});

/**
 * @swagger
 * /listings:
 *   post:
 *     summary: Crear publicación
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, title]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [offer, need]
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               location:
 *                 type: string
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Publicación creada
 */
router.post('/', authenticateJWT, async (req, res) => {
  const { type, title, description, category, quantity, location, photos } = req.body;
  if (!type || !title) return res.status(400).json({ error: 'Faltan campos obligatorios' });
  // author_id viene del usuario autenticado
  const author_id = req.user.id;
  const result = await db.query(
    'INSERT INTO listings (author_id, type, title, description, category, quantity, location, photos) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
    [author_id, type, title, description, category, quantity, location, photos]
  );
  res.status(201).json(result.rows[0]);
});

/**
 * @swagger
 * /listings/{id}:
 *   get:
 *     summary: Obtener detalle de publicación
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de publicación
 *       404:
 *         description: No encontrada
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await db.query('SELECT * FROM listings WHERE id = $1', [id]);
  if (!result.rows[0]) return res.status(404).json({ error: 'No encontrada' });
  res.json(result.rows[0]);
});

/**
 * @swagger
 * /listings/{id}:
 *   put:
 *     summary: Editar publicación
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               location:
 *                 type: string
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [active, closed]
 *     responses:
 *       200:
 *         description: Publicación actualizada
 *       404:
 *         description: No encontrada
 */
router.put('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const fields = req.body;
  const keys = Object.keys(fields);
  if (keys.length === 0) return res.status(400).json({ error: 'Nada para actualizar' });
  // Only allow editing own listings
  const check = await db.query('SELECT * FROM listings WHERE id = $1', [id]);
  if (!check.rows[0]) return res.status(404).json({ error: 'No encontrada' });
  if (check.rows[0].author_id !== req.user.id) return res.status(403).json({ error: 'No autorizado' });
  const set = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
  const values = keys.map(k => fields[k]);
  values.push(id);
  const result = await db.query(`UPDATE listings SET ${set} WHERE id = $${values.length} RETURNING *`, values);
  res.json(result.rows[0]);
});

/**
 * @swagger
 * /listings/{id}:
 *   delete:
 *     summary: Eliminar publicación
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Eliminada
 *       404:
 *         description: No encontrada
 */
router.delete('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  // Only allow deleting own listings
  const check = await db.query('SELECT * FROM listings WHERE id = $1', [id]);
  if (!check.rows[0]) return res.status(404).json({ error: 'No encontrada' });
  if (check.rows[0].author_id !== req.user.id) return res.status(403).json({ error: 'No autorizado' });
  await db.query('DELETE FROM listings WHERE id = $1', [id]);
  res.status(204).send();
});


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */


// Proponer donación
router.post('/:id/match', authenticateJWT, async (req, res) => {
  const listingId = Number(req.params.id);
  const me = req.user.id;
  const lres = await db.query('SELECT * FROM listings WHERE id = $1', [listingId]);
  const listing = lres.rows[0];
  if (!listing) return res.status(404).json({ error: 'Publicación no encontrada' });
  if (listing.author_id === me) return res.status(400).json({ error: 'No podés proponer sobre tu propia publicación' });

  // Determine roles based on listing type
  const isOffer = listing.type === 'offer';
  const donor_id = isOffer ? listing.author_id : me;
  const receiver_id = isOffer ? me : listing.author_id;

  try {
    const q = `INSERT INTO donations(listing_id, donor_id, receiver_id, proposed_by_id)
               VALUES ($1,$2,$3,$4)
               ON CONFLICT ON CONSTRAINT donations_distinct
               DO UPDATE SET proposed_by_id = EXCLUDED.proposed_by_id
               RETURNING *`;
    const { rows } = await db.query(q, [listingId, donor_id, receiver_id, me]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
