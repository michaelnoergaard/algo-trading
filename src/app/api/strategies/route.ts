import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/db';

// GET /api/strategies - List all strategies
export async function GET() {
  try {
    const sql = getSql();
    const result = await sql`
      SELECT id, name, description, code, created_at, updated_at
      FROM strategies
      ORDER BY updated_at DESC
    ` as any[];

    return NextResponse.json({
      strategies: result,
    });
  } catch (error: any) {
    console.error('Failed to fetch strategies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch strategies', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/strategies - Create a new strategy
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, code } = body;

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Strategy name is required' },
        { status: 400 }
      );
    }

    if (!code || !code.trim()) {
      return NextResponse.json(
        { error: 'Strategy code is required' },
        { status: 400 }
      );
    }

    // Insert strategy
    const sql = getSql();
    const result = await sql`
      INSERT INTO strategies (name, description, code)
      VALUES (${name.trim()}, ${description?.trim() || null}, ${code})
      RETURNING id, name, description, code, created_at, updated_at
    ` as any[];

    return NextResponse.json({
      strategy: result[0],
      message: 'Strategy saved successfully',
    });
  } catch (error: any) {
    console.error('Failed to save strategy:', error);
    return NextResponse.json(
      { error: 'Failed to save strategy', details: error.message },
      { status: 500 }
    );
  }
}
