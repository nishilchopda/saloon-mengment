const { pool } = require('../config/db');

exports.getStaffAppointments = async (req, res) => {
  try {
    // First find if this user is a staff member
    const staff = await pool.query('SELECT id FROM staff WHERE name = (SELECT name FROM users WHERE id = $1)', [req.user.id]);
    if (staff.rows.length === 0) return res.json([]);

    const appointments = await pool.query(`
      SELECT b.*, u.name as customer_name, s.name as service_name
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN services s ON b.service_id = s.id
      WHERE b.staff_id = $1
      ORDER BY b.booking_date DESC
    `, [staff.rows[0].id]);
    res.json(appointments.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const booking = await pool.query('UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    res.json(booking.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
