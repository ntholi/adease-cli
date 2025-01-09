import { baseDir } from '@/utils/config';
import Answers from '../../types/Answers';
import { Field } from '../../types/Field';
import { BaseGenerator } from '../BaseGenerator';

class ExceptionsGenerator extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers, 'skip');
  }

  async generate(): Promise<void> {
    await this.compile('RouteUtils/template.ejs', 'routeHandler.ts');
  }

  protected getOutputDir(): string {
    return baseDir('utils');
  }
}

export default ExceptionsGenerator;
