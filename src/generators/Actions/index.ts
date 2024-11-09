import path from 'path';
import { fileURLToPath } from 'url';
import Answers from '../../types/Answers';
import { Field } from '../../types/Field';
import { BaseGenerator } from '../BaseGenerator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ActionsGenerator extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers);
  }

  async generate(): Promise<void> {
    const templateFile = this.answers.serviceFile
      ? 'service.ejs'
      : 'repository.ejs';

    await this.compile(path.join(__dirname, templateFile), 'actions.ts', {});
  }
}

export default ActionsGenerator;
