const { pool } = require('./src/config/db');
const bcrypt = require('bcryptjs');

const seed = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Create Admin
    await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
      ['Admin User', 'shubhboda@gmail.com', hashedPassword, 'Admin']
    );

    // Create Salon Owner
    const ownerRes = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email RETURNING id',
      ['Salon Owner One', 'owner@example.com', hashedPassword, 'Salon Owner']
    );
    const ownerId = ownerRes.rows[0].id;

    // Create Salon
    const salonRes = await pool.query(
      'INSERT INTO salons (owner_id, name, location) VALUES ($1, $2, $3) RETURNING id',
      [ownerId, 'Elite Hair & Spa', 'Downtown, New York']
    );
    const salonId = salonRes.rows[0].id;

    // Create Services
    await pool.query(
      'INSERT INTO services (salon_id, name, price, description) VALUES ($1, $2, $3, $4), ($1, $5, $6, $7)',
      [salonId, 'Haircut', 50.00, 'Professional haircut and styling', 'Full Spa', 120.00, 'Relaxing full body spa session']
    );

    // Create Staff
    await pool.query(
      'INSERT INTO staff (salon_id, name, role) VALUES ($1, $2, $3), ($1, $4, $5)',
      [salonId, 'John Doe', 'Senior Stylist', 'Jane Smith', 'Therapist']
    );

    console.log('Sample data seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seed();
