import Answers from '../../types/Answers';
import { Field } from '../../types/Field';
import { BaseGenerator } from '../BaseGenerator';

class EditPageGenerator extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers, 'skip');
  }

  async generate(): Promise<void> {
    const templateName = `EditPage/${this.database}.template.ejs`;
    await this.compile(templateName, '/[id]/edit/page.tsx');
  }
}

export default EditPageGenerator;
