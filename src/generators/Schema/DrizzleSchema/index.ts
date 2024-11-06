import path from 'path';
import { fileURLToPath } from 'url';
import { BaseGenerator } from '../../BaseGenerator';
import { Field } from '../../../types/Field';
import Answers from '../../../types/Answers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DrizzleSchemaGenerator extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers, false);
  }

  async generate(): Promise<void> {
    if (this.answers.database !== 'drizzle') return;

    await this.compile(
      path.join(__dirname, 'template.ejs'),
      '../../db/schema/index.ts',
      { fields: this.fields }
    );
  }
}

export default DrizzleSchemaGenerator;
