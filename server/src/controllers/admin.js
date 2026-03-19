const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

// Super Admin: Create Salon Owner
exports.createSalonOwner = async (req, res) => {
  const { name, email, password, salonName, location } = req.body;

  try {
    // Start transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Create user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const userRes = await client.query(
        'INSERT INTO users (name, email, password, role, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [name, email, hashedPassword, 'salon_owner', req.user.id]
      );
      const ownerId = userRes.rows[0].id;

      // Create salon
      const salonRes = await client.query(
        'INSERT INTO salons (owner_id, name, location) VALUES ($1, $2, $3) RETURNING *',
        [ownerId, salonName, location]
      );

      await client.query('COMMIT');
      res.status(201).json({ ownerId, salon: salonRes.rows[0] });
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

exports.getStats = async (req, res) => {
  try {
    const ownerCount = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'salon_owner'");
    const salonCount = await pool.query('SELECT COUNT(*) FROM salons');
    const bookingCount = await pool.query('SELECT COUNT(*) FROM bookings');
    const revenue = await pool.query("SELECT SUM(s.price) FROM bookings b JOIN services s ON b.service_id = s.id WHERE b.status = 'Completed'");

    res.json({
      owners: parseInt(ownerCount.rows[0].count),
      salons: parseInt(salonCount.rows[0].count),
      bookings: parseInt(bookingCount.rows[0].count),
      revenue: parseFloat(revenue.rows[0].sum || 0)
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllOwners = async (req, res) => {
  try {
    const owners = await pool.query(`
      SELECT u.id, u.name, u.email, s.name as salon_name, s.location
      FROM users u
      LEFT JOIN salons s ON u.id = s.owner_id
      WHERE u.role = 'salon_owner'
    `);
    res.json(owners.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(users.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await pool.query(`
      SELECT b.*, u.name AS customer_name, s.name AS service_name, sa.name AS salon_name, st.name AS staff_name
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      LEFT JOIN services s ON b.service_id = s.id
      LEFT JOIN salons sa ON b.salon_id = sa.id
      LEFT JOIN staff st ON b.staff_id = st.id
      ORDER BY b.booking_date DESC
    `);
    res.json(bookings.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteRes = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    if (deleteRes.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
