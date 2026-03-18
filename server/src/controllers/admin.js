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
