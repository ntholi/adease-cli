import path from 'path';
import { fileURLToPath } from 'url';
import { BaseGenerator } from '../../BaseGenerator';
import { Field } from '../../../types/Field';
import Answers from '../../../types/Answers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PrismaSchemaGenerator extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers, false); // Set shouldOverride to false
  }

  async generate(): Promise<void> {
    if (this.answers.database !== 'prisma') return;

    await this.compile(
      path.join(__dirname, 'template.ejs'),
      '../../prisma/schema.prisma',
      { fields: this.fields }
    );
  }
}

export default PrismaSchemaGenerator;
