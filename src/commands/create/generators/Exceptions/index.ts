import Answers from '../../types/Answers';
import { BaseGenerator } from '../BaseGenerator';
import { Field } from '../../types/Field';
import { baseDir } from '@/utils/config';

class ExceptionsGenerator extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers, 'skip', baseDir('utils'));
  }

  async generate(): Promise<void> {
    await this.compile('Exceptions/template.ejs', 'exceptions.ts');
  }
}

export default ExceptionsGenerator;
