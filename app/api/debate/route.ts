import { sql } from '../../lib/db/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { topic, proModel, conModel, messages } = await request.json();

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
        ${messages.map((m: { role: string }) => m.role)}::text[],
        ${messages.map((m: { content: string }) => m.content)}::text[]
      ) AS t(role, content)
      RETURNING debate_id
    `;

    return NextResponse.json({ id: result[0].debate_id });
  } catch (error) {
    console.error('Failed to save debate:', error);
    return NextResponse.json(
      { error: 'Failed to save debate' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Debate ID is required' },
        { status: 400 }
      );
    }

    const debate = await sql`
      SELECT * FROM debates WHERE id = ${id}
    `;

    if (!debate.length) {
      return NextResponse.json(
        { error: 'Debate not found' },
        { status: 404 }
      );
    }

    const messages = await sql`
      SELECT * FROM debate_messages
      WHERE debate_id = ${id}
      ORDER BY created_at ASC
    `;

    return NextResponse.json({
      debate: debate[0],
      messages
    });
  } catch (error) {
    console.error('Failed to fetch debate:', error);
    return NextResponse.json(
      { error: 'Failed to fetch debate' },
      { status: 500 }
    );
  }
}