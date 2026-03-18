const express = require('express');
const router = express.Router();
const { getStaffAppointments, updateAppointmentStatus } = require('../controllers/staff');
const { auth, authorize } = require('../middleware/auth');

router.use(auth, authorize('Staff'));

router.get('/appointments', getStaffAppointments);
router.put('/appointments/:id', updateAppointmentStatus);

module.exports = router;
