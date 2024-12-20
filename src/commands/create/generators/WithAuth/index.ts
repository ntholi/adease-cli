import { baseDir } from '@/utils/config';
import Answers from '../../types/Answers';
import { Field } from '../../types/Field';
import { BaseGenerator } from '../BaseGenerator';

class WithAuth extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers, 'skip');
  }

  async generate(): Promise<void> {
    await this.compile('WithAuth/template.ejs', '/withAuth.ts');
  }

  protected getOutputDir(): string {
    return baseDir('server/base');
  }
}

export default WithAuth;
