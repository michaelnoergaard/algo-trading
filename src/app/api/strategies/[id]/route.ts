import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/db';

// DELETE /api/strategies/[id] - Delete a strategy
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const strategyId = parseInt(id);

    if (isNaN(strategyId)) {
      return NextResponse.json(
        { error: 'Invalid strategy ID' },
        { status: 400 }
      );
    }

    // Delete the strategy (CASCADE will delete related backtests and trades)
    const sql = getSql();
    const result = await sql`
      DELETE FROM strategies
      WHERE id = ${strategyId}
      RETURNING id
    ` as any[];

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Strategy not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Strategy deleted successfully',
      id: strategyId,
    });
  } catch (error: any) {
    console.error('Failed to delete strategy:', error);
    return NextResponse.json(
      { error: 'Failed to delete strategy', details: error.message },
      { status: 500 }
    );
  }
}
