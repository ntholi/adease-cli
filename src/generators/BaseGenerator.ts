import path from 'path';
import Answers from '../types/Answers';
import { readConfig } from '../utils/config';
import fs from 'fs/promises';
import ejs from 'ejs';
import { Field } from '../types/Field';

export abstract class BaseGenerator {
  private outputDir: string;

  constructor(
    protected readonly tableName: string,
    protected readonly fields: Field[],
    protected readonly answers: Answers
  ) {
    const config = readConfig();
    this.outputDir = path.join(
      process.cwd(),
      config.baseDir,
      config.adminDir,
      tableName
    );
  }

  protected async compile(
    templatePath: string,
    outputPath: string
  ): Promise<void> {
    const template = await fs.readFile(templatePath, 'utf8');
    const compiled = ejs.compile(template);
    const outputFilePath = path.join(this.outputDir, outputPath);
    await fs.mkdir(path.dirname(outputFilePath), { recursive: true });
    await fs.writeFile(outputFilePath, compiled({}));
  }

  abstract generate(): Promise<void>;
}
