import { baseDir } from '@/utils/config';
import Answers from '../../types/Answers';
import { Field } from '../../types/Field';
import { BaseGenerator } from '../BaseGenerator';

class RepositoryGenerator extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers, 'skip');
  }

  async generate(): Promise<void> {
    await this.compile(
      `Repository/${this.database}.template.ejs`,
      `${this.tableName}/repository.ts`
    );
  }

  protected getOutputDir(): string {
    return baseDir('server');
  }
}

export default RepositoryGenerator;
