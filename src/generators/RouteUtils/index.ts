import Answers from '../../types/Answers';
import { BaseGenerator } from '../BaseGenerator';
import { Field } from '../../types/Field';

class RouteUtilsGenerator extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers, 'skip', 'utils');
  }

  async generate(): Promise<void> {
    await this.compile('RouteUtils/template.ejs', 'exceptions.ts');
  }
}

export default RouteUtilsGenerator;
