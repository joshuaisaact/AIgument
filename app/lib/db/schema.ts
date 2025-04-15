import { sql } from './client';

export async function createTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS debates (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      topic TEXT NOT NULL,
      pro_model TEXT NOT NULL,
      con_model TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS debate_messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      debate_id UUID REFERENCES debates(id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT valid_role CHECK (role IN ('pro', 'con'))
    );
  `;
}