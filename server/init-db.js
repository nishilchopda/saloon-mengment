const { pool } = require('./src/config/db');
require('dotenv').config();

const createTables = async () => {
  const queryText = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) CHECK (role IN ('Admin', 'Salon Owner', 'Staff', 'Customer')) DEFAULT 'Customer',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS salons (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      location TEXT NOT NULL,
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

    CREATE TABLE IF NOT EXISTS staff (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(100),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      service_id UUID REFERENCES services(id) ON DELETE CASCADE,
      staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
      salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
      booking_date TIMESTAMP WITH TIME ZONE NOT NULL,
      status VARCHAR(50) CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')) DEFAULT 'Pending',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(queryText);
    console.log('Tables created successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error creating tables:', err);
    process.exit(1);
  }
};

createTables();
