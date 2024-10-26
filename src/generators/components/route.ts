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

const ${singularName}Schema = createInsertSchema(${tableName});

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
    
    const validatedData = ${singularName}Schema.parse(body);
    const result = await ${service}.create(validatedData);
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

const ${singularName}Schema = createInsertSchema(${tableName});

type Props = {
  params: { id: string }
};

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const result = await ${service}.get(id);
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
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = ${singularName}Schema.parse(body);
    
    const result = await ${service}.update(id, validatedData);
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

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const result = await ${service}.delete(id);
    if (!result) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}`;

  return { mainRoute, idRoute };
}
