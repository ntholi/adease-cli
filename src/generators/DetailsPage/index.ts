import path from 'path';
import { fileURLToPath } from 'url';
import Answers from '../../types/Answers';
import { BaseGenerator } from '../BaseGenerator';
import { Field } from '../../types/Field';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DetailsPage extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers);
  }

  async generate(): Promise<void> {
    await this.compile(path.join(__dirname, 'template.ejs'), '/[id]/page.tsx');
  }
}

export default DetailsPage;
