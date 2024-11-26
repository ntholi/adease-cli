import path from 'path';
import ejs from 'ejs';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { readConfig } from '../../utils/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class RootIndexGenerator {
  private readonly outputDir: string;

  constructor() {
    const config = readConfig();
    this.outputDir = path.join(
      process.cwd(),
      config.baseDir,
      'app',
      config.adminDir
    );
  }

  private async compile(
    templatePath: string,
    outputPath: string
  ): Promise<string> {
    const template = await fs.readFile(
      path.join(__dirname, templatePath),
      'utf8'
    );
    const compiled = ejs.compile(template);
    const content = compiled({});

    const outputFilePath = path.join(this.outputDir, outputPath);
    await fs.mkdir(path.dirname(outputFilePath), { recursive: true });
    await fs.writeFile(outputFilePath, content);

    return content;
  }

  async generate(): Promise<void> {
    await this.compile('RootIndex/index.ejs', 'index.ts');
    await this.compile('RootIndex/layout.ejs', 'layout.ts');
  }
}

export default RootIndexGenerator;
