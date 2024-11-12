import Answers from '../../types/Answers';
import { BaseGenerator } from '../BaseGenerator';
import { Field } from '../../types/Field';

class DetailsPage extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers);
  }

  async generate(): Promise<void> {
    await this.compile('DetailsPage/template.ejs', '/[id]/page.tsx');
  }
}

export default DetailsPage;
