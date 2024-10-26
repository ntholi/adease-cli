import { capitalize, singular } from '../../utils/word';

export function generateService(tableName: string) {
  return `'use server'
  
import { ${capitalize(singular(tableName))}Repository } from './repository';
import { ${tableName} } from '@/db/schema';
import withAuth from '@/lib/auth/withAuth';

type ${capitalize(singular(tableName))} = typeof ${tableName}.$inferInsert;

class ${capitalize(tableName)}Service {
  constructor(private readonly repository = new ${capitalize(
    singular(tableName)
  )}Repository()) {}

  async first() {
    return withAuth(async () => this.repository.findFirst(), []);
  }

  async get(id: number) {
    return withAuth(async () => this.repository.findById(id), []);
  }

  async search(
    page: number = 1,
    search = '',
    searchProperties: (keyof typeof ${tableName})[] = [],
    pageSize: number = 15
  ) {
    return withAuth(
      async () => this.repository.search(page, search, searchProperties, pageSize),
      []
    );
  }

  async create(data: ${capitalize(singular(tableName))}) {
    return withAuth(async () => this.repository.create(data), []);
  }

  async update(id: number, data: ${capitalize(singular(tableName))}) {
    return withAuth(async () => this.repository.update(id, data), []);
  }

  async delete(id: number) {
    return withAuth(async () => this.repository.delete(id), []);
  }

  async count() {
    return withAuth(async () => this.repository.count(), []);
  }
}

export const ${singular(tableName)}Service = new ${capitalize(
    tableName
  )}Service();
`;
}
