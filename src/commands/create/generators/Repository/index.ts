import Answers from '../../types/Answers';
import { BaseGenerator } from '../BaseGenerator';
import { Field } from '../../types/Field';
import { baseDir } from '@/utils/config';

class RepositoryGenerator extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers, 'skip', baseDir('repositories'));
  }

  async generate(): Promise<void> {
    await this.compile(
      'Repository/template.ejs',
      `${this.tableName}/repository.ts`
    );
  }
}

export default RepositoryGenerator;
