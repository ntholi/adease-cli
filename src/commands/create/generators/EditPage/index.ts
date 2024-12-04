import Answers from '../../types/Answers';
import { Field } from '../../types/Field';
import { BaseGenerator } from '../BaseGenerator';

class EditPage extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers);
  }

  async generate(): Promise<void> {
    await this.compile(
      `EditPage/${this.database}.template.ejs`,
      '/[id]/edit/page.tsx'
    );
  }
}

export default EditPage;
