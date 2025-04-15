'use server';

import { sql } from '../db/client';
import { v4 as uuidv4 } from 'uuid';

interface SaveDebateParams {
  topic: string;
  proModel: string;
  conModel: string;
  messages: Array<{
    role: 'pro' | 'con';
    content: string;
  }>;
}

export async function saveDebate({ topic, proModel, conModel, messages }: SaveDebateParams) {
  try {
    const debateId = uuidv4();

    // Insert debate
    await sql`
      INSERT INTO debates (id, topic, pro_model, con_model)
      VALUES (${debateId}, ${topic}, ${proModel}, ${conModel})
    `;

    // Insert messages
    for (const message of messages) {
      await sql`
        INSERT INTO debate_messages (debate_id, role, content)
        VALUES (${debateId}, ${message.role}, ${message.content})
      `;
    }

    return debateId;
  } catch (error) {
    console.error('Failed to save debate:', error);
    throw new Error('Failed to save debate');
  }
}

export async function getDebate(id: string) {
  try {
    const debate = await sql`
      SELECT * FROM debates WHERE id = ${id}
    `;

    if (!debate.length) {
      return null;
    }

    const messages = await sql`
      SELECT * FROM debate_messages
      WHERE debate_id = ${id}
      ORDER BY created_at ASC
    `;

    return {
      debate: debate[0],
      messages
    };
  } catch (error) {
    console.error('Failed to fetch debate:', error);
    throw new Error('Failed to fetch debate');
  }
}