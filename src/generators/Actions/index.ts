import Answers from '../../types/Answers';
import { Field } from '../../types/Field';
import { BaseGenerator } from '../BaseGenerator';

class ActionsGenerator extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers, 'skip');
  }

  async generate(): Promise<void> {
    await this.compile(`RootIndex/layout.ejs`, 'layout.tsx', {});
    await this.compile('RootIndex/index.ejs', 'index.tsx', {});
  }
}

export default ActionsGenerator;
