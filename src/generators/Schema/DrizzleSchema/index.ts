import { BaseGenerator } from '../../BaseGenerator';
import { Field } from '../../../types/Field';
import Answers from '../../../types/Answers';
import { glob } from 'glob';
import { baseDir } from '../../../utils/config';

class DrizzleSchemaGenerator extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers, 'append', baseDir('db'));
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

    await this.compile('Schema/DrizzleSchema/template.ejs', findSchemaPath(), {
      fields: mappedFields,
    });
  }
}

function findSchemaPath(): string {
  const schemaFolder = glob.sync(baseDir('db/schema'));
  if (schemaFolder.length > 0) {
    return `schema/index.ts`;
  }
  return 'schema.ts';
}

export default DrizzleSchemaGenerator;
