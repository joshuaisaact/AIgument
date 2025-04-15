import { neon } from '@neondatabase/serverless';
import './envConfig';

if (process.env.NODE_ENV === 'development') {
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

export const sql = neon(process.env.DATABASE_URL);