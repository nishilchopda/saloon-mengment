const { pool } = require('../config/db');

exports.getAllSalons = async (req, res) => {
  try {
    const salons = await pool.query('SELECT * FROM salons');
    res.json(salons.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getSalonServices = async (req, res) => {
  const { salonId } = req.params;
  try {
    const services = await pool.query('SELECT * FROM services WHERE salon_id = $1', [salonId]);
    res.json(services.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getSalonStaff = async (req, res) => {
  const { salonId } = req.params;
  try {
    const staff = await pool.query('SELECT * FROM staff WHERE salon_id = $1', [salonId]);
    res.json(staff.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createBooking = async (req, res) => {
  const { salonId, serviceId, staffId, bookingDate } = req.body;
  try {
    const booking = await pool.query(
      'INSERT INTO bookings (user_id, salon_id, service_id, staff_id, booking_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, salonId, serviceId, staffId, bookingDate]
    );
    res.json(booking.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await pool.query(`
      SELECT b.*, s.name as service_name, s.price, sa.name as salon_name, st.name as staff_name
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN salons sa ON b.salon_id = sa.id
      LEFT JOIN staff st ON b.staff_id = st.id
      WHERE b.user_id = $1
      ORDER BY b.booking_date DESC
    `, [req.user.id]);
    res.json(bookings.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
