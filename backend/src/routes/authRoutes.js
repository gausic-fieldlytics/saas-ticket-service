const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
  const { username } = req.body;
  const token = jwt.sign({ username, role: 'Admin' }, process.env.JWT_SECRET);
  res.json({ token });
});

module.exports = router;