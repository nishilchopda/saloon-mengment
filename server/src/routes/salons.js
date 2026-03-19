const express = require('express');
const router = express.Router();
const {
  getOwnerStats,
  getMySalon,
  getSalonServicesByOwner,
  getSalonStaffByOwner,
  getSalonBookings,
  updateSalonBookingStatus,
  createStaff,
  createCustomerInvite
} = require('../controllers/salons');
const { auth, authorize } = require('../middleware/auth');

router.use(auth, authorize('salon_owner'));

router.get('/stats', getOwnerStats);
router.get('/my-salon', getMySalon);
router.get('/services', getSalonServicesByOwner);
router.get('/staff', getSalonStaffByOwner);
router.get('/bookings', getSalonBookings);
router.put('/bookings/:id', updateSalonBookingStatus);
router.post('/staff', createStaff);
router.post('/customers/invite', createCustomerInvite);

module.exports = router;
