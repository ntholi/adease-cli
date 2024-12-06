import { baseDir } from '@/utils/config';
import { glob } from 'glob';
import Answers from '../../../types/Answers';
import { Field } from '../../../types/Field';
import { BaseSchemaGenerator } from '../BaseSchemaGenerator';

class DrizzleSchemaGenerator extends BaseSchemaGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers, 'append', baseDir('db'));
  }

  private mapFieldType(type: string): string {
    if (this.databaseEngine === 'sqlite') {
      switch (type.toLowerCase()) {
        case 'string':
        case 'text':
          return 'text';
        case 'number':
          return 'integer';
        case 'boolean':
          return 'integer';
        case 'date':
          return 'integer';
        default:
          return 'text';
      }
    } else {
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
  }

  async generate(): Promise<void> {
    if (this.database !== 'drizzle') return;

    const mappedFields = this.fields.map((field) => ({
      ...field,
      type: this.mapFieldType(field.type),
    }));

    const templateName = this.databaseEngine === 'sqlite' 
      ? 'Schema/DrizzleSchema/sqlite.template.ejs'
      : 'Schema/DrizzleSchema/postgresql.template.ejs';

    await this.compile(templateName, findSchemaPath(), {
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
