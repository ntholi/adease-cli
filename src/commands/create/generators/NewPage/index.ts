import { kebabCase } from '@/utils';
import Answers from '../../types/Answers';
import { Field } from '../../types/Field';
import { BaseGenerator } from '../BaseGenerator';

class NewPageGenerator extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers, 'skip');
  }

  async generate(): Promise<void> {
    const templateName = `NewPage/${this.database}.template.ejs`;
    await this.compile(
      templateName,
      `${kebabCase(this.tableName)}/new/page.tsx`
    );
  }
}

export default NewPageGenerator;
