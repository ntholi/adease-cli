import { NextRequest } from 'next/server';
import { handleRoute } from '@/utils/routeHandler';
import { authorsService } from '@/repositories/authors/service';

export async function GET(request: NextRequest) {
  return handleRoute(async () => {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    
    return authorsService.search(page, search, []);
  });
}

export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    const data = await request.json();
    return authorsService.create(data);
  });
} 