const express = require('express');
const router = express.Router();
const {
  getOwnerStats, createStaff, createCustomerInvite
} = require('../controllers/salons');
const { auth, authorize } = require('../middleware/auth');

router.use(auth, authorize('salon_owner'));

router.get('/stats', getOwnerStats);
router.post('/staff', createStaff);
router.post('/customers/invite', createCustomerInvite);

module.exports = router;
