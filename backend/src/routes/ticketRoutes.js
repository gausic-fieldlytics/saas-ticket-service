const router = require('express').Router();
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  res.json([{ id: 1, title: "Sample Ticket", status: "Open" }]);
});

module.exports = router;