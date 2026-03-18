const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'services routes' }));

module.exports = router;
