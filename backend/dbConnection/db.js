import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  database: process.env.DB_NAME || process.env.DB_DATABASE, // Handles both key variants!
});

// Attach a global error listener to prevent the Node process from exiting silently
pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection error:', err.stack);
    return;
  }
  console.log('Successfully connected to PostgreSQL Database! 🎉');
  release();
});

export default pool;