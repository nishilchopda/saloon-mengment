const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

// Salon Owner Dashboard: Get Stats
exports.getOwnerStats = async (req, res) => {
  try {
    const salonRes = await pool.query('SELECT id FROM salons WHERE owner_id = $1', [req.user.id]);
    if (salonRes.rows.length === 0) return res.status(404).json({ message: 'Salon not found' });
    const salonId = salonRes.rows[0].id;

    const staffCount = await pool.query('SELECT COUNT(*) FROM staff WHERE salon_id = $1', [salonId]);
    const serviceCount = await pool.query('SELECT COUNT(*) FROM services WHERE salon_id = $1', [salonId]);
    const bookingCount = await pool.query('SELECT COUNT(*) FROM bookings WHERE salon_id = $1', [salonId]);
    const earnings = await pool.query("SELECT SUM(s.price) FROM bookings b JOIN services s ON b.service_id = s.id WHERE b.salon_id = $1 AND b.status = 'Completed'", [salonId]);

    res.json({
      staff: parseInt(staffCount.rows[0].count),
      services: parseInt(serviceCount.rows[0].count),
      bookings: parseInt(bookingCount.rows[0].count),
      earnings: parseFloat(earnings.rows[0].sum || 0)
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Salon Owner Dashboard: Create Staff Account
exports.createStaff = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const salonRes = await pool.query('SELECT id FROM salons WHERE owner_id = $1', [req.user.id]);
    const salonId = salonRes.rows[0].id;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const userRes = await client.query(
        'INSERT INTO users (name, email, password, role, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [name, email, hashedPassword, 'staff', req.user.id]
      );
      const loginId = userRes.rows[0].id;

      const staffRes = await client.query(
        'INSERT INTO staff (salon_id, name, role, login_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [salonId, name, role, loginId]
      );

      await client.query('COMMIT');
      res.status(201).json(staffRes.rows[0]);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Salon Owner Dashboard: Generate Customer Invite
exports.createCustomerInvite = async (req, res) => {
  const { name, phone } = req.body;
  const bookingId = Math.random().toString(36).substring(2, 8).toUpperCase();

  try {
    const salonRes = await pool.query('SELECT id FROM salons WHERE owner_id = $1', [req.user.id]);
    const salonId = salonRes.rows[0].id;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const userRes = await client.query(
        'INSERT INTO users (name, role, booking_id, created_by) VALUES ($1, $2, $3, $4) RETURNING id',
        [name, 'customer', bookingId, req.user.id]
      );
      const customerUserId = userRes.rows[0].id;

      const customerRes = await client.query(
        'INSERT INTO customers (salon_id, name, phone, optional_login_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [salonId, name, phone, customerUserId]
      );

      await client.query('COMMIT');
      res.status(201).json({ customer: customerRes.rows[0], bookingId });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
