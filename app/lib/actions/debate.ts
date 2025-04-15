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
  spiciness?: string;
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

export async function saveDebate({ topic, proModel, conModel, messages, spiciness = 'medium' }: SaveDebateParams) {
  const debateId = uuidv4();

  try {
    // Insert debate
    await db`
      INSERT INTO debates (id, topic, pro_model, con_model, spiciness)
      VALUES (${debateId}, ${topic}, ${proModel}, ${conModel}, ${spiciness})
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
    if (error instanceof Error) {
      // Add more context to the error
      const enhancedError = new Error(`Failed to save debate: ${error.message}`);
      enhancedError.stack = error.stack;
      throw enhancedError;
    }
    throw new Error('Failed to save debate: Unknown error');
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

// Define a type for the list item structure
interface DebateListItem {
  id: string;
  topic: string;
  pro_model: ModelType;
  con_model: ModelType;
  created_at: string; // Or Date
}

// Function to list recent public debates
export async function listDebates(): Promise<DebateListItem[]> {
  const limit = 50;
  try {
    // Use db directly, without generic type argument
    const result = await db`
      SELECT id, topic, pro_model, con_model, created_at
      FROM debates
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;

    // Cast the result to the expected type after receiving it.
    // Add basic validation if necessary, though casting is common here.
    const debates = result as unknown as DebateListItem[];

    // Optional: Add runtime validation if you want to be extra safe
    // if (!Array.isArray(debates) || debates.some(d => typeof d.id !== 'string')) {
    //   throw new Error("Invalid data structure received from database.");
    // }

    return debates;

  } catch (error) {
    console.error("Database Error: Failed to fetch debates.", error);
    throw new Error("Failed to fetch recent debates.");
  }
}