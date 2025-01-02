import ejs from 'ejs';
import fs from 'fs/promises';
import path from 'path';
import { baseDir } from '@/utils/config';
import { fileURLToPath } from 'url';
import { INIT_DESTINATION_DIR } from '../..';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hooks = ['useViewSelect'];

class HooksGenerator {
  async compile(template: string, outputPath: string): Promise<void> {
    const templatePath = path.join(__dirname, template);
    const templateContent = await fs.readFile(templatePath, 'utf8');
    const compiledContent = ejs.render(templateContent, {});
    const outputFilePath = path.join(baseDir('hooks'), outputPath);

    await fs.mkdir(path.dirname(outputFilePath), { recursive: true });
    await fs.writeFile(outputFilePath, compiledContent);
  }

  async generate(): Promise<void> {
    for (const component of hooks) {
      await this.compile(
        `${INIT_DESTINATION_DIR}/Hooks/${component}.ejs`,
        `${component}.tsx`
      );
    }
  }
}

export default HooksGenerator;
