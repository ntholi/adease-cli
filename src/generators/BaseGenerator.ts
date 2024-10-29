import path from 'path';
import Answers from '../types/Answers';
import { readConfig } from '../utils/config';
import fs from 'fs/promises';
import ejs from 'ejs';
import { Field } from '../types/Field';
import pluralize from 'pluralize';

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

    const templateData = {
      tableName: this.tableName,
      properties: this.fields,
      typeName: this.pascalCase(this.tableName),
      plural: (str: string) => `${str}s`,
      capitalize: (str: string) => str.charAt(0).toUpperCase() + str.slice(1),
      wordSpace: (str: string) => str.replace(/([A-Z])/g, ' $1').trim(),
    };

    await fs.writeFile(outputFilePath, compiled(templateData));
  }

  private pascalCase(str: string): string {
    return str
      .split(/[-_\s]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }

  abstract generate(): Promise<void>;
}
