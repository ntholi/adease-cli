import Answers from '../../types/Answers';
import { BaseGenerator } from '../BaseGenerator';
import { Field } from '../../types/Field';
import { baseDir } from '../../utils/config';

class ServiceGenerator extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers, 'skip', baseDir('repositories'));
  }

  async generate(): Promise<void> {
    if (!this.answers.serviceFile) return;

    await this.compile('Service/template.ejs', `${this.tableName}/service.ts`);
  }
}

export default ServiceGenerator;
