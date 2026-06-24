const router = require('express').Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Get all applications
router.get('/applications', auth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM applications ORDER BY name ASC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all clients
router.get('/clients', auth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM clients ORDER BY name ASC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
