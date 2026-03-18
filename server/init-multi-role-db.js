const { pool } = require('./src/config/db');
require('dotenv').config();

const createTables = async () => {
  const queryText = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- Drop existing tables if needed (uncomment for fresh start)
    -- DROP TABLE IF EXISTS bookings CASCADE;
    -- DROP TABLE IF EXISTS services CASCADE;
    -- DROP TABLE IF EXISTS customers CASCADE;
    -- DROP TABLE IF EXISTS staff CASCADE;
    -- DROP TABLE IF EXISTS salons CASCADE;
    -- DROP TABLE IF EXISTS users CASCADE;

    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE,
      password VARCHAR(255),
      role VARCHAR(50) CHECK (role IN ('super_admin', 'salon_owner', 'staff', 'customer')) DEFAULT 'customer',
      created_by UUID REFERENCES users(id) ON DELETE SET NULL,
      booking_id VARCHAR(50) UNIQUE, -- Unique code for customers
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS salons (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      location TEXT NOT NULL,
      theme_config JSONB, -- For custom salon styling
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS staff (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(100),
      login_id UUID REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS customers (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      optional_login_id UUID REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS services (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
      salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
      service_id UUID REFERENCES services(id) ON DELETE CASCADE,
      staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
      booking_date TIMESTAMP WITH TIME ZONE NOT NULL,
      status VARCHAR(50) CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')) DEFAULT 'Pending',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(queryText);
    console.log('Multi-role hierarchical tables created successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error creating multi-role tables:', err);
    process.exit(1);
  }
};

createTables();
