import { sql } from './client';
import { ModelType } from '../../hooks/useModelProvider';

export interface Debate {
  id: string;
  topic: string;
  pro_model: ModelType;
  con_model: ModelType;
  created_at: string;
  updated_at: string;
}

export interface DebateMessage {
  id: string;
  debate_id: string;
  role: 'pro' | 'con';
  content: string;
  created_at: string;
}

export async function saveDebate(
  topic: string,
  proModel: ModelType,
  conModel: ModelType,
  messages: { role: 'pro' | 'con'; content: string }[]
): Promise<string> {
  const result = await sql`
    WITH new_debate AS (
      INSERT INTO debates (topic, pro_model, con_model)
      VALUES (${topic}, ${proModel}, ${conModel})
      RETURNING id
    )
    INSERT INTO debate_messages (debate_id, role, content)
    SELECT id, role, content
    FROM new_debate
    CROSS JOIN UNNEST(
      ${messages.map(m => m.role)}::text[],
      ${messages.map(m => m.content)}::text[]
    ) AS t(role, content)
    RETURNING debate_id
  `;

  return result[0].debate_id;
}

export async function getDebate(id: string): Promise<{
  debate: Debate;
  messages: DebateMessage[];
} | null> {
  const debateResult = await sql`
    SELECT * FROM debates WHERE id = ${id}
  `;

  if (!debateResult.length) return null;

  const debate: Debate = {
    id: debateResult[0].id,
    topic: debateResult[0].topic,
    pro_model: debateResult[0].pro_model as ModelType,
    con_model: debateResult[0].con_model as ModelType,
    created_at: debateResult[0].created_at,
    updated_at: debateResult[0].updated_at
  };

  const messagesResult = await sql`
    SELECT * FROM debate_messages
    WHERE debate_id = ${id}
    ORDER BY created_at ASC
  `;

  const messages: DebateMessage[] = messagesResult.map(msg => ({
    id: msg.id,
    debate_id: msg.debate_id,
    role: msg.role as 'pro' | 'con',
    content: msg.content,
    created_at: msg.created_at
  }));

  return {
    debate,
    messages
  };
}