import { singular } from '../../utils/word';

export function generateRouteHandlers(
  tableName: string,
  hasServiceFile: boolean
) {
  const singularName = singular(tableName);
  const service = hasServiceFile
    ? `${singularName}Service`
    : `${singularName}Repository`;

  const serviceImport = hasServiceFile
    ? `import { ${singularName}Service } from '@/server/${tableName}/service';`
    : `import { ${singularName}Repository } from '@/server/${tableName}/repository';`;

  // Generate the main route.ts file
  const mainRoute = `import { NextRequest, NextResponse } from 'next/server';
${serviceImport}
import { ${tableName} } from '@/db/schema';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

const schema = createInsertSchema(${tableName});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') ?? '1');
    const search = searchParams.get('search') ?? '';

    const result = await ${service}.search(page, search, []);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await ${service}.create(schema.parse(body));
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}`;

  // Generate the [id]/route.ts file
  const idRoute = `import { NextRequest, NextResponse } from 'next/server';
${serviceImport}
import { ${tableName} } from '@/db/schema';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

const schema = createInsertSchema(${tableName});

type Props = {
  params: { id: string }
};

export async function GET(_: NextRequest, { params }: Props) {
  try {
    const result = await ${service}.get(Number(params.id));
    if (!result) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const body = await request.json();
    
    const result = await ${service}.update(
      Number(params.id),
      schema.parse(body)
    );
    if (!result) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: Props) {
  try {
    await ${service}.delete(Number(params.id));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}`;

  return { mainRoute, idRoute };
}
