const { pool } = require('./src/config/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seed = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    
    // 1. Create Super Admin
    const adminPassword = await bcrypt.hash('shubh@9090', salt);
    const adminRes = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password RETURNING id",
      ['Super Admin', 'shubhboda@gmail.com', adminPassword, 'super_admin']
    );
    const adminId = adminRes.rows[0].id;

    // 2. Create Salon Owner
    const ownerPassword = await bcrypt.hash('owner@123', salt);
    const ownerRes = await pool.query(
      "INSERT INTO users (name, email, password, role, created_by) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password RETURNING id",
      ['Premium Owner', 'owner@luxe.com', ownerPassword, 'salon_owner', adminId]
    );
    const ownerId = ownerRes.rows[0].id;

    // 3. Create Salon
    const salonRes = await pool.query(
      "INSERT INTO salons (owner_id, name, location) VALUES ($1, $2, $3) RETURNING id",
      [ownerId, 'Madhav', 'Bandra, Mumbai']
    );
    const salonId = salonRes.rows[0].id;

    // 4. Create Staff
    const staffPassword = await bcrypt.hash('staff@123', salt);
    const staffUserRes = await pool.query(
      "INSERT INTO users (name, email, password, role, created_by) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password RETURNING id",
      ['Expert Stylist', 'staff@luxe.com', staffPassword, 'staff', ownerId]
    );
    const staffUserId = staffUserRes.rows[0].id;

    await pool.query(
      "INSERT INTO staff (salon_id, name, role, login_id) VALUES ($1, $2, $3, $4)",
      [salonId, 'Expert Stylist', 'Senior Barber', staffUserId]
    );

    // 5. Create Customer with Booking ID
    const customerPassword = await bcrypt.hash('customer@123', salt);
    const bookingId = 'LUXE77';
    const customerRes = await pool.query(
      "INSERT INTO users (name, email, password, role, booking_id) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password RETURNING id",
      ['John Doe', 'customer@luxe.com', customerPassword, 'customer', bookingId]
    );
    const customerId = customerRes.rows[0].id;

    await pool.query(
      "INSERT INTO customers (salon_id, name, phone, optional_login_id) VALUES ($1, $2, $3, $4)",
      [salonId, 'John Doe', '9876543210', customerId]
    );

    console.log('Hierarchical seed data created successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seed();
