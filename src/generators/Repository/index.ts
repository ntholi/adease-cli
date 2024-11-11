import path from 'path';
import { fileURLToPath } from 'url';
import Answers from '../../types/Answers';
import { BaseGenerator } from '../BaseGenerator';
import { Field } from '../../types/Field';
import { baseDir } from '../../utils/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class RepositoryGenerator extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers, 'skip', baseDir('repositories'));
  }

  async generate(): Promise<void> {
    await this.compile(
      path.join(__dirname, 'template.ejs'),
      `${this.tableName}/repository.ts`
    );
  }
}

export default RepositoryGenerator;
