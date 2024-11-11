import path from 'path';
import { fileURLToPath } from 'url';
import Answers from '../../types/Answers';
import { BaseGenerator } from '../BaseGenerator';
import { Field } from '../../types/Field';
import { baseDir } from '../../utils/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class RouteHandlerGenerator extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers, 'skip', baseDir('/app/api/'));
  }

  async generate(): Promise<void> {
    if (!this.answers.apiRoutes) return;

    const templatePrefix = this.answers.serviceFile ? 'service' : 'repository';

    await this.compile(
      path.join(__dirname, `template.${templatePrefix}.ejs`),
      'route.ts'
    );

    await this.compile(
      path.join(__dirname, `id-template.${templatePrefix}.ejs`),
      '[id]/route.ts'
    );
  }
}

export default RouteHandlerGenerator;
