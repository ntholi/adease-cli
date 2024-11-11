import path from 'path';
import { fileURLToPath } from 'url';
import Answers from '../../types/Answers';
import { BaseGenerator } from '../BaseGenerator';
import { Field } from '../../types/Field';
import { baseDir } from '../../utils/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ServiceGenerator extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers, 'skip', baseDir('repositories'));
  }

  async generate(): Promise<void> {
    if (!this.answers.serviceFile) return;

    await this.compile(
      path.join(__dirname, 'template.ejs'),
      `${this.tableName}/service.ts`
    );
  }
}

export default ServiceGenerator;
