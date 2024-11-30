import path from 'path';
import ejs from 'ejs';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { readConfig } from '@/utils/config';
import { INIT_DESTINATION_DIR } from '../Components';

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
    await this.compile(
      `${INIT_DESTINATION_DIR}/RootIndex/layout.ejs`,
      'layout.tsx'
    );
    await this.compile(
      `${INIT_DESTINATION_DIR}/RootIndex/index.ejs`,
      'page.tsx'
    );
  }
}

export default RootIndexGenerator;
