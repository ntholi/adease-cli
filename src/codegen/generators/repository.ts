import path from 'path';
import fs from 'fs/promises';
import { capitalize, singular } from '../../utils/word';

export function generateRepository(tableName: string) {
  return `import BaseRepository from '@/lib/repository/BaseRepository';
import { ${tableName} } from '@/db/schema';

export class ${capitalize(
    singular(tableName)
  )}Repository extends BaseRepository<typeof ${tableName}, 'id'> {
  constructor() {
    super(${tableName}, 'id');
  }
}

export const ${singular(tableName)}Repository = new ${capitalize(
    singular(tableName)
  )}Repository();
`;
}

export async function generateBaseRepository() {
  const pathName = path.join(
    process.cwd(),
    'src/lib/repository',
    'BaseRepository.tsx'
  );
  await fs.mkdir(path.dirname(pathName), { recursive: true });

  // try {
  //   await fs.access(pathName);
  //   console.log('Repository file already exists. Skipping...');
  // } catch (error) {
  await fs.writeFile(pathName, getContent());
  // }
}

function getContent() {
  return `import { db } from '@/db';
import { count, eq, like, or } from 'drizzle-orm';
import { PgColumn, PgTable } from 'drizzle-orm/pg-core';

type ModelInsert<T extends PgTable> = T['$inferInsert'];
type ModelSelect<T extends PgTable> = T['$inferSelect'];

class BaseRepository<
  T extends PgTable,
  PK extends keyof T & keyof ModelSelect<T>
> {
  constructor(private table: T, private primaryKey: PK) {}

  async findFirst(): Promise<ModelSelect<T> | undefined> {
    return await db.select()
      .from(this.table)
      .limit(1)
      .then(([result]) => result);
  }

  async findById(id: ModelSelect<T>[PK]): Promise<ModelSelect<T> | undefined> {
    const [result] = await db
      .select()
      .from(this.table)
      .where(eq(this.table[this.primaryKey] as PgColumn, id))
      .limit(1);
    return result;
  }

  async findAll(
    offset: number = 0,
    limit: number = 10
  ): Promise<ModelSelect<T>[]> {
    return await db.select().from(this.table).limit(limit).offset(offset);
  }

  async search(
    page: number = 1,
    search: string,
    searchProperties: (keyof T)[],
    pageSize: number = 15
  ): Promise<{ items: ModelSelect<T>[]; pages: number }> {
    const offset = (page - 1) * pageSize;
    const data = await db
      .select()
      .from(this.table)
      .where(
        or(
          ...searchProperties.map((property) =>
            like(this.table[property as keyof T] as PgColumn, \`%$\{search}%\`)
          )
        )
      )
      .limit(pageSize)
      .offset(offset);
    return {
      items: data,
      pages: Math.ceil(data.length / pageSize),
    };
  }

  async exists(id: ModelSelect<T>[PK]): Promise<boolean> {
    const [result] = await db
      .select({ count: count() })
      .from(this.table)
      .where(eq(this.table[this.primaryKey] as PgColumn, id))
      .limit(1);
    return result?.count > 0;
  }

  async create(data: ModelInsert<T>): Promise<ModelSelect<T>> {
    const [inserted] = await db.insert(this.table).values(data).returning();
    return inserted;
  }

  async update(
    id: ModelSelect<T>[PK],
    data: Partial<ModelInsert<T>>
  ): Promise<ModelSelect<T>> {
    const [updated] = await db
      .update(this.table)
      .set(data)
      .where(eq(this.table[this.primaryKey] as PgColumn, id))
      .returning();
    return updated;
  }

  async delete(id: ModelSelect<T>[PK]): Promise<void> {
    await db
      .delete(this.table)
      .where(eq(this.table[this.primaryKey] as PgColumn, id));
  }

  async count(): Promise<number> {
    const [result] = await db.select({ count: count() }).from(this.table);
    return result?.count ?? 0;
  }

  async deleteAll(): Promise<void> {
    await db.delete(this.table);
  }
}

export default BaseRepository;`;
}
