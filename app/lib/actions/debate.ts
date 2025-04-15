'use server';

import { db } from '../db/client';
import { v4 as uuidv4 } from 'uuid';
import { ModelType } from '@/app/hooks/useModelProvider';

interface SaveDebateParams {
  topic: string;
  proModel: string;
  conModel: string;
  messages: Array<{
    role: 'pro' | 'con';
    content: string;
  }>;
}

interface Debate {
  id: string;
  topic: string;
  pro_model: ModelType;
  con_model: ModelType;
  created_at: string;
  updated_at: string;
}

interface DebateMessage {
  id: string;
  debate_id: string;
  role: 'pro' | 'con';
  content: string;
  created_at: string;
}

export async function saveDebate({ topic, proModel, conModel, messages }: SaveDebateParams) {
  const debateId = uuidv4();

  try {
    // Insert debate
    await db`
      INSERT INTO debates (id, topic, pro_model, con_model)
      VALUES (${debateId}, ${topic}, ${proModel}, ${conModel})
    `;

    // Insert messages
    for (const message of messages) {
      await db`
        INSERT INTO debate_messages (debate_id, role, content)
        VALUES (${debateId}, ${message.role}, ${message.content})
      `;
    }

    return debateId;
  } catch (error) {
    console.error('Error saving debate:', error);
    throw error;
  }
}

export async function getDebate(id: string) {
  try {
    const debate = (await db`
      SELECT * FROM debates WHERE id = ${id}
    `) as Debate[];

    if (!debate || debate.length === 0) {
      return null;
    }

    const messages = (await db`
      SELECT * FROM debate_messages
      WHERE debate_id = ${id}
      ORDER BY created_at ASC
    `) as DebateMessage[];

    return {
      debate: debate[0],
      messages
    };
  } catch (error) {
    console.error('Error fetching debate:', error);
    throw error;
  }
}