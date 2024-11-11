import path from 'path';
import { fileURLToPath } from 'url';
import Answers from '../../types/Answers';
import { BaseGenerator } from '../BaseGenerator';
import { Field } from '../../types/Field';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class RouteUtilsGenerator extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers, 'skip', 'utils');
  }

  async generate(): Promise<void> {
    await this.compile(path.join(__dirname, 'template.ejs'), 'routeHandler.ts');
  }
}

export default RouteUtilsGenerator;
