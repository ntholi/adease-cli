import ejs from 'ejs';
import fs from 'fs/promises';
import path from 'path';
import { baseDir } from '../../utils/config';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const components = ['SearchField', 'Pagination', 'ListItem', 'ListLayout'];

class ComponentsGenerator {
  async compile(template: string, outputPath: string): Promise<void> {
    const templatePath = path.join(__dirname, template);
    const templateContent = await fs.readFile(templatePath, 'utf8');
    const compiledContent = ejs.render(templateContent, {});
    const outputFilePath = path.join(baseDir('components/adease'), outputPath);

    await fs.mkdir(path.dirname(outputFilePath), { recursive: true });
    await fs.writeFile(outputFilePath, compiledContent);
  }

  async generate(): Promise<void> {
    for (const component of components) {
      await this.compile(`Components/${component}.ejs`, `${component}.tsx`);
    }
  }
}

export default ComponentsGenerator;
