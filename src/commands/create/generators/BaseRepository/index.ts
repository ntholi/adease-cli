import { BaseGenerator } from '../BaseGenerator';
import Answers from '../../types/Answers';
import { baseDir } from '@/utils/config';
import { Field } from '../../types/Field';

class BaseRepositoryGenerator extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers, 'skip');
  }

  async generate(): Promise<void> {
    if (this.database === 'prisma') {
      console.warn(
        "Skipping BaseRepository for Prisma, I'm still yet to complete it's template"
      );
      return;
    }

    if (this.database === 'drizzle') {
      // Use the unified template for both SQLite and PostgreSQL
      await this.compile('BaseRepository/drizzle.ejs', 'BaseRepository.ts');
      return;
    }

    await this.compile(
      `BaseRepository/${this.database}.ejs`,
      'BaseRepository.ts'
    );
  }

  protected getOutputDir(): string {
    return baseDir('server/base');
  }
}

export default BaseRepositoryGenerator;
