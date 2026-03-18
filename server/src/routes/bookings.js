const express = require('express');
const router = express.Router();
const { getAllSalons, getSalonServices, getSalonStaff, createBooking, getMyBookings } = require('../controllers/bookings');
const { auth } = require('../middleware/auth');

// Public or User routes
router.get('/salons', getAllSalons);
router.get('/salons/:salonId/services', getSalonServices);
router.get('/salons/:salonId/staff', getSalonStaff);

// Protected User routes
router.post('/', auth, createBooking);
router.get('/my-bookings', auth, getMyBookings);

module.exports = router;
