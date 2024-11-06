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

  private mapFieldType(type: string): string {
    switch (type.toLowerCase()) {
      case 'string':
        return 'varchar';
      case 'number':
        return 'integer';
      case 'boolean':
        return 'boolean';
      case 'date':
        return 'timestamp';
      default:
        return 'text';
    }
  }

  async generate(): Promise<void> {
    if (this.answers.database !== 'drizzle') return;

    const mappedFields = this.fields.map((field) => ({
      ...field,
      type: this.mapFieldType(field.type),
    }));

    await this.compile(
      path.join(__dirname, 'template.ejs'),
      '../../../db/schema/index.ts',
      { fields: mappedFields }
    );
  }
}

export default DrizzleSchemaGenerator;
