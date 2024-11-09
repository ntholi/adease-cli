import path from 'path';
import { fileURLToPath } from 'url';
import { BaseGenerator } from '../../BaseGenerator';
import { Field } from '../../../types/Field';
import Answers from '../../../types/Answers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FirebaseSchemaGenerator extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers, 'append');
  }

  private mapFieldType(type: string): string {
    switch (type.toLowerCase()) {
      case 'string':
        return 'string';
      case 'number':
        return 'number';
      case 'boolean':
        return 'boolean';
      case 'date':
        return 'Date';
      case 'float':
        return 'number';
      default:
        return 'any';
    }
  }

  async generate(): Promise<void> {
    if (this.answers.database !== 'firebase') return;

    const mappedFields = this.fields.map((field) => ({
      ...field,
      type: this.mapFieldType(field.type),
    }));

    await this.compile(
      path.join(__dirname, 'template.ejs'),
      `../../${this.tableName}.ts`,
      { fields: mappedFields }
    );
  }
}

export default FirebaseSchemaGenerator;
