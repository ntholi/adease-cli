import { baseDir } from '@/utils/config';
import { glob } from 'glob';
import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs/promises';
import ejs from 'ejs';
import pluralize from 'pluralize';
import { DESTINATION_DIR } from '../../BaseGenerator';
import Answers from '../../../types/Answers';
import { Field } from '../../../types/Field';
import { BaseSchemaGenerator } from '../BaseSchemaGenerator';
import { fileURLToPath } from 'url';

interface ImportStatement {
  source: string;
  items: Set<string>;
  originalText: string;
  multiline: boolean;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseImports(content: string, source: string): ImportStatement | null {
  const regex = new RegExp(`import\\s*{([^}]+)}\\s*from\\s*['"]${source}['"]`, 'g');
  const match = regex.exec(content);
  
  if (!match) return null;
  
  const importItems = match[1]
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0);
  
  return {
    source,
    items: new Set(importItems),
    originalText: match[0],
    multiline: match[1].includes('\n')
  };
}

function mergeImports(existingImport: ImportStatement | null, templateImport: ImportStatement): string {
  if (!existingImport) {
    return templateImport.originalText;
  }

  const mergedItems = new Set([...existingImport.items, ...templateImport.items]);
  const itemsArray = Array.from(mergedItems);
  
  if (existingImport.multiline) {
    const itemsStr = itemsArray.join(',\n  ');
    return `import {\n  ${itemsStr}\n} from '${existingImport.source}';`;
  } else {
    const itemsStr = itemsArray.join(', ');
    return `import { ${itemsStr} } from '${existingImport.source}';`;
  }
}

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

  protected async compile(
    templatePath: string,
    outputPath: string,
    templateData?: Record<string, any>
  ): Promise<string> {
    const template = await fs.readFile(
      path.join(__dirname, `${DESTINATION_DIR}/${templatePath}`),
      'utf8'
    );
    const compiled = ejs.compile(template);

    const data = {
      tableName: pluralize.plural(this.tableName),
      TableName: this.pascalCase(pluralize.singular(this.tableName)),
      fields: this.fields,
      TableWord: this.pascalCase(this.asWord(this.tableName)),
      adminDir: this.adminDir,
      database: this.database,
      capitalize: this.capitalize,
      singular: (str: string) => pluralize.singular(str),
      plural: (str: string) => pluralize.plural(str),
      asWord: this.asWord,
      ...templateData
    };

    let content = compiled(data);
    let existingContent = '';
    const outputFilePath = path.join(this.outputDir, outputPath);

    try {
      existingContent = await fs.readFile(outputFilePath, 'utf8');
    } catch (error) {}

    // Handle import statements
    const importSources = ['drizzle-orm/sqlite-core', 'drizzle-orm/pg-core'];
    for (const source of importSources) {
      const templateImport = parseImports(content, source);
      if (templateImport) {
        const existingImport = parseImports(existingContent, source);
        const mergedImport = mergeImports(existingImport, templateImport);
        
        if (existingImport) {
          content = content.replace(templateImport.originalText, '');
          existingContent = existingContent.replace(existingImport.originalText, mergedImport);
        }
      }
    }

    if (this.overrideMode === 'append' && existingContent) {
      if (existingContent.includes(this.tableName)) {
        return content;
      }
      content = `${existingContent}\n${content}`;
    }

    await fs.mkdir(path.dirname(outputFilePath), { recursive: true });
    await fs.writeFile(outputFilePath, content);

    return content;
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
