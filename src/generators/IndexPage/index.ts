import { BaseGenerator } from '../BaseGenerator';
import ejs from 'ejs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Answers from '../../types/Answers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class IndexPageGenerator extends BaseGenerator {
  constructor(answers: Answers) {
    super(answers);
  }

  async generate(): Promise<void> {
    const template = await fs.readFile(
      path.join(__dirname, 'template.ejs'),
      'utf8'
    );
    const compiled = ejs.compile(template);
    const output = compiled({});
    await fs.writeFile(path.join(process.cwd(), 'index.ts'), output);
  }
}

export default IndexPageGenerator;
