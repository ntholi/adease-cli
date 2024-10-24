import path from 'path';
import fs from 'fs/promises';

export async function generateRepository() {
  const pathName = path.join(
    process.cwd(),
    'src/lib/repository',
    'BaseRepository.tsx'
  );
  await fs.mkdir(path.dirname(pathName), { recursive: true });

  try {
    await fs.access(pathName);
    console.log('Repository file already exists. Skipping...');
  } catch (error) {
    await fs.writeFile(pathName, getContent());
  }
}

function getContent() {
  return `import { count, eq, like, or } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { PgColumn, PgTable } from 'drizzle-orm/pg-core';

type ModelInsert<T extends PgTable> = T['$inferInsert'];
type ModelSelect<T extends PgTable> = T['$inferSelect'];

class BaseRepository<
  TSchema extends Record<string, PgTable>,
  T extends PgTable,
  PK extends keyof T & keyof ModelSelect<T>
> {
  constructor(
    private db: NodePgDatabase<TSchema>,
    private table: T,
    private primaryKey: PK
  ) {}

  async findById(id: ModelSelect<T>[PK]): Promise<ModelSelect<T> | undefined> {
    const [result] = await this.db
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
    return await this.db.select().from(this.table).limit(limit).offset(offset);
  }

  async search(
    search: string,
    properties: (keyof ModelSelect<T>)[],
    offset: number = 0,
    limit: number = 10
  ): Promise<ModelSelect<T>[]> {
    return await this.db
      .select()
      .from(this.table)
      .where(
        or(
          ...properties.map((property) =>
            like(this.table[property as keyof T] as PgColumn, \`%$\{search}%\`)
          )
        )
      )
      .limit(limit)
      .offset(offset);
  }

  async exists(id: ModelSelect<T>[PK]): Promise<boolean> {
    const [result] = await this.db
      .select({ count: count() })
      .from(this.table)
      .where(eq(this.table[this.primaryKey] as PgColumn, id))
      .limit(1);
    return result?.count > 0;
  }

  async create(data: ModelInsert<T>): Promise<ModelSelect<T>> {
    const [inserted] = await this.db
      .insert(this.table)
      .values(data)
      .returning();
    return inserted;
  }

  async update(
    id: ModelSelect<T>[PK],
    data: Partial<ModelInsert<T>>
  ): Promise<ModelSelect<T>> {
    const [updated] = await this.db
      .update(this.table)
      .set(data)
      .where(eq(this.table[this.primaryKey] as PgColumn, id))
      .returning();
    return updated;
  }

  async delete(id: ModelSelect<T>[PK]): Promise<void> {
    await this.db
      .delete(this.table)
      .where(eq(this.table[this.primaryKey] as PgColumn, id));
  }

  async count(): Promise<number> {
    const [result] = await this.db.select({ count: count() }).from(this.table);
    return result?.count ?? 0;
  }

  async deleteAll(): Promise<void> {
    await this.db.delete(this.table);
  }
}

export default BaseRepository;`;
}
