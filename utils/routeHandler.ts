import { NextResponse } from 'next/server';

export async function routeException<T>(handler: () => Promise<T>) {
  try {
    const result = await handler();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Route error:', error);

    if (error.code === 'NOT_FOUND') {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    if (error.code === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (error.code === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (error.code === 'VALIDATION_ERROR') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
