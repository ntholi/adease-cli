import { readConfig } from '@/utils/config';
import ejs from 'ejs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INIT_DESTINATION_DIR } from '../..';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class RootIndexGenerator {
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
    const template = await fsPromises.readFile(
      path.join(__dirname, templatePath),
      'utf8'
    );
    const compiled = ejs.compile(template);
    const content = compiled({});

    const outputFilePath = path.join(this.outputDir, outputPath);
    await fsPromises.mkdir(path.dirname(outputFilePath), { recursive: true });
    await fsPromises.writeFile(outputFilePath, content);

    return content;
  }

  async generate(): Promise<void> {
    const components = ['page', 'layout', 'dashboard', 'providers'];

    for (let it of components) {
      await this.compile(
        `${INIT_DESTINATION_DIR}/RootIndex/${it}.ejs`,
        `${it}.tsx`
      );
    }
  }
}

export default RootIndexGenerator;
