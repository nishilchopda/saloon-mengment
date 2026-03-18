# Premium Salon Management Web Application

A full-stack, high-end Salon Management Web Application built with React, Node.js, and PostgreSQL (Supabase).

## Features

- **Authentication System**: Secure JWT-based auth with bcrypt hashing.
- **Role-based Dashboards**:
  - **Admin**: Manage all users, salons, and view platform-wide analytics.
  - **Salon Owner**: Manage services, staff, and view appointments for their salon.
  - **Staff**: View and manage their own daily appointment schedule.
  - **Customer**: Browse salons, book services, and view booking history.
- **Booking System**: Real-time appointment booking with status tracking.
- **Modern UI**: Premium dark/light mode UI built with Tailwind CSS and Lucide icons.

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Lucide React, Axios, React Router.
- **Backend**: Node.js, Express.js.
- **Database**: PostgreSQL (Supabase).
- **Auth**: JSON Web Tokens (JWT), Bcrypt.

## Project Structure

```
saloon/
├── client/          # Frontend React application
└── server/          # Backend Node.js API
```

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- npm

### Installation

1. Clone the repository and navigate to the project root.
2. Install dependencies for both client and server:
   ```bash
   npm run install-all
   ```

### Configuration

1. Create a `.env` file in the `server/` directory with the following variables:
   ```env
   PORT=5000
   DATABASE_URL=your_supabase_postgresql_url
   JWT_SECRET=your_jwt_secret
   ADMIN_EMAIL=shubhboda@gmail.com
   ```

### Database Initialization

1. Initialize the database tables:
   ```bash
   npm run init-db
   ```
2. Seed sample data (optional):
   ```bash
   cd server && node seed.js
   ```

### Running the Application

1. Start both client and server in development mode:
   ```bash
   npm run dev
   ```
2. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Credentials for Testing

- **Admin**: shubhboda@gmail.com / password123
- **Salon Owner**: owner@example.com / password123
- **Customer**: Create a new account via the Register page.
