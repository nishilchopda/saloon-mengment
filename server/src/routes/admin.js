const express = require('express');
const router = express.Router();
const { createSalonOwner, getStats, getAllOwners } = require('../controllers/admin');
const { auth, authorize } = require('../middleware/auth');

router.use(auth, authorize('super_admin'));

router.post('/owners', createSalonOwner);
router.get('/stats', getStats);
router.get('/owners', getAllOwners);

module.exports = router;
