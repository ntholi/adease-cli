import { baseDir } from '@/utils/config';
import { glob } from 'glob';
import inquirer from 'inquirer';
import path from 'path';
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

    const schemaPath = await findSchemaPath();
    await this.compile(templateName, schemaPath, {
      fields: mappedFields,
    });
  }
}

async function findSchemaPath(): Promise<string> {
  const schemaFolder = baseDir('db/schema');
  const schemaFiles = glob.sync('**/*.ts', { cwd: schemaFolder });
  
  if (schemaFiles.length === 0) {
    return 'schema.ts';
  }
  
  if (schemaFiles.length === 1) {
    return path.join('schema', schemaFiles[0]);
  }
  
  const { selectedFile } = await inquirer.prompt([{
    type: 'list',
    name: 'selectedFile',
    message: 'Multiple schema files found. Which one would you like to use?',
    choices: schemaFiles
  }]);
  
  return path.join('schema', selectedFile);
}

export default DrizzleSchemaGenerator;
