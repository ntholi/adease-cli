import path from 'path';
import { fileURLToPath } from 'url';
import Answers from '../../types/Answers';
import { BaseGenerator } from '../BaseGenerator';
import { Field } from '../../types/Field';
import pluralize from 'pluralize';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ActionsGenerator extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers);
  }

  async generate(): Promise<void> {
    const tableName = pluralize.plural(this.tableName);
    await this.compile(path.join(__dirname, 'template.ejs'), 'actions.ts', {
      serviceImport: this.answers.serviceFile
        ? `import { ${tableName}Service } from '@/services/${tableName}/service';`
        : `import { ${tableName}Repository } from '@/services/${tableName}/repository';`,
      serviceName: this.answers.serviceFile
        ? `${tableName}Service`
        : `${tableName}Repository`,
      hasService: this.answers.serviceFile,
    });
  }
}

export default ActionsGenerator;
