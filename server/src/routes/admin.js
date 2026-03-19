const express = require('express');
const router = express.Router();
const { createSalonOwner, getStats, getAllOwners, getAllUsers, getAllBookings, deleteUser } = require('../controllers/admin');
const { auth, authorize } = require('../middleware/auth');

router.use(auth, authorize('super_admin'));

router.post('/owners', createSalonOwner);
router.get('/stats', getStats);
router.get('/owners', getAllOwners);
router.get('/users', getAllUsers);
router.get('/bookings', getAllBookings);
router.delete('/users/:id', deleteUser);

module.exports = router;
