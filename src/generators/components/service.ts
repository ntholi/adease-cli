import { capitalize, singular } from '../../utils/word';

export function generateService(tableName: string) {
  return `'use server'
  
import { ${capitalize(tableName)}Repository } from './repository';
import { ${tableName} } from '@/db/schema';

type ${capitalize(singular(tableName))} = typeof ${tableName}.$inferInsert;

class ${capitalize(tableName)}Service {
  constructor(
    private readonly repository = new ${capitalize(tableName)}Repository(),
    private readonly pageSize = 15
  ) {}

  async first() {
    return this.repository.findFirst();
  }

  async get(id: number) {
    return this.repository.findById(id);
  }

  async search(
    page: number = 1,
    search = '',
    searchProperties: (keyof typeof ${tableName})[] = []
  ) {
    const offset = (page - 1) * this.pageSize;
    return this.repository.search(
      search,
      searchProperties,
      offset,
      this.pageSize
    );
  }

  async create(data: ${capitalize(singular(tableName))}) {
    return this.repository.create(data);
  }

  async update(id: number, data: ${capitalize(singular(tableName))}) {
    return this.repository.update(id, data);
  }

  async delete(id: number) {
    return this.repository.delete(id);
  }

  async count() {
    return this.repository.count();
  }
}

export const ${singular(tableName)}Service = new ${capitalize(
    tableName
  )}Service();
`;
}
