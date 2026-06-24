const router = require('express').Router();
const auth = require('../middleware/auth');
const db = require('../config/db');

// List tickets with filters
router.get('/', auth, async (req, res) => {
  try {
    const { status, application_id, client_id, priority, assigned_to } = req.query;
    let query = `
      SELECT t.*, a.name as app_name, c.name as client_name, u.name as assignee_name, cb.name as creator_name
      FROM tickets t
      LEFT JOIN applications a ON t.application_id = a.id
      LEFT JOIN clients c ON t.client_id = c.id
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN users cb ON t.created_by = cb.id
      WHERE 1=1
    `;
    const params = [];

    if (status) { params.push(status); query += ` AND t.status = $${params.length}`; }
    if (application_id) { params.push(application_id); query += ` AND t.application_id = $${params.length}`; }
    if (client_id) { params.push(client_id); query += ` AND t.client_id = $${params.length}`; }
    if (priority) { params.push(priority); query += ` AND t.priority = $${params.length}`; }
    if (assigned_to) { params.push(assigned_to); query += ` AND t.assigned_to = $${params.length}`; }

    query += ' ORDER BY t.created_at DESC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single ticket details
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT t.*, a.name as app_name, c.name as client_name, u.name as assignee_name, cb.name as creator_name
      FROM tickets t
      LEFT JOIN applications a ON t.application_id = a.id
      LEFT JOIN clients c ON t.client_id = c.id
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN users cb ON t.created_by = cb.id
      WHERE t.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Ticket not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new ticket
router.post('/', auth, async (req, res) => {
  try {
    const { application_id, client_id, type, title, description, priority } = req.body;
    const user_id = req.user.id;
    const ticket_no = `TKT-${Date.now()}`; 

    const result = await db.query(
      `INSERT INTO tickets 
      (ticket_no, application_id, client_id, type, title, description, priority, status, created_by) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'Open', $8) RETURNING *`,
      [ticket_no, application_id, client_id, type, title, description, priority, user_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update ticket / Assign
router.put('/:id', auth, async (req, res) => {
  try {
    const { status, assigned_to, comment } = req.body;
    const ticketId = req.params.id;
    const userId = req.user.id;

    // Update ticket
    const updateQuery = `
      UPDATE tickets 
      SET status = COALESCE($1, status), 
          assigned_to = COALESCE($2, assigned_to),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3 RETURNING *
    `;
    const result = await db.query(updateQuery, [status, assigned_to, ticketId]);

    // Add log
    if (comment || status) {
        await db.query(
          `INSERT INTO ticket_logs (ticket_id, comment, status, updated_by) VALUES ($1, $2, $3, $4)`,
          [ticketId, comment, status || result.rows[0].status, userId]
        );
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Get ticket logs
router.get('/:id/logs', auth, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT l.*, u.name as user_name 
            FROM ticket_logs l
            LEFT JOIN users u ON l.updated_by = u.id
            WHERE ticket_id = $1
            ORDER BY l.updated_at DESC
        `, [req.params.id]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;