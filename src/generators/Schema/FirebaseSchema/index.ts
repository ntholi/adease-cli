import path from 'path';
import { fileURLToPath } from 'url';
import { BaseGenerator } from '../../BaseGenerator';
import { Field } from '../../../types/Field';
import Answers from '../../../types/Answers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FirebaseSchemaGenerator extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers, false);
  }

  async generate(): Promise<void> {
    if (this.answers.database !== 'firebase') return;

    await this.compile(
      path.join(__dirname, 'template.ejs'),
      `../../${this.tableName}.ts`
    );
  }
}

export default FirebaseSchemaGenerator;
