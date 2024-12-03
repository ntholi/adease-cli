import Answers from '../../types/Answers';
import { BaseGenerator } from '../BaseGenerator';
import { Field } from '../../types/Field';

class NewPage extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers);
  }

  async generate(): Promise<void> {
    await this.compile(
      `NewPage/${this.database}.template.ejs`,
      '/new/page.tsx'
    );
  }
}

export default NewPage;
