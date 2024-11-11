import { NextRequest } from 'next/server';
import { routeException } from '@/utils/routeHandler';
import { authorsService } from '@/repositories/authors/service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return routeException(async () => {
    const id = parseInt(params.id);
    return authorsService.get(id);
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return routeException(async () => {
    const id = parseInt(params.id);
    const data = await request.json();
    return authorsService.update(id, data);
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return routeException(async () => {
    const id = parseInt(params.id);
    return authorsService.delete(id);
  });
}
