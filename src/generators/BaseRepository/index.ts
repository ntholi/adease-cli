import path from 'path';
import { fileURLToPath } from 'url';
import Answers from '../../types/Answers';
import { BaseGenerator } from '../BaseGenerator';
import { Field } from '../../types/Field';
import { withBaseDir } from '../../utils/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class BaseRepositoryGenerator extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers, false, withBaseDir('lib'));
  }

  async generate(): Promise<void> {
    await this.compile(
      path.join(__dirname, 'template.ejs'),
      'BaseRepository.ts'
    );
  }
}

export default BaseRepositoryGenerator;
