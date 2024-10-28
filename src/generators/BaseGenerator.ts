import { fileURLToPath } from 'url';
import Answers from '../types/Answers';
import { readConfig } from '../utils/config';
import path from 'path';
import ejs from 'ejs';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export abstract class BaseGenerator {
  protected config: { baseDir: string; adminDir: string };

  constructor(protected readonly answers: Answers) {
    this.config = readConfig();
  }

  protected async generateFile(
    template: string,
    output: string
  ): Promise<void> {
    const temp = await fs.readFile(path.join(__dirname, template), 'utf8');
    const compiled = ejs.compile(temp);
    await fs.writeFile(path.join(process.cwd(), output), compiled({}));
  }

  abstract generate(): Promise<void>;
}
