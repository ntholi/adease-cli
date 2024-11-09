import path from 'path';
import Answers from '../types/Answers';
import { readConfig } from '../utils/config';
import fs from 'fs/promises';
import ejs from 'ejs';
import { Field } from '../types/Field';
import pluralize from 'pluralize';

export abstract class BaseGenerator {
  constructor(
    protected readonly tableName: string,
    protected readonly fields: Field[],
    protected readonly answers: Answers,
    protected readonly shouldOverride: boolean = true,
    private readonly outputDir: string = ''
  ) {
    const config = readConfig();
    if (!outputDir) {
      this.outputDir = path.join(
        process.cwd(),
        config.baseDir,
        config.adminDir,
        tableName
      );
    } else {
      this.outputDir = path.join(process.cwd(), outputDir);
    }
  }

  protected async compile(
    templatePath: string,
    outputPath: string,
    templateData?: Record<string, any>
  ): Promise<string> {
    const template = await fs.readFile(templatePath, 'utf8');
    const compiled = ejs.compile(template);

    const data = {
      tableName: pluralize.plural(this.tableName),
      TableName: this.pascalCase(pluralize.singular(this.tableName)),
      fields: this.fields,
      TableWord: this.pascalCase(this.asWord(this.tableName)),
      capitalize: this.capitalize,
      singular: (str: string) => pluralize.singular(str),
      plural: (str: string) => pluralize.plural(str),
      asWord: this.asWord,
    };

    let content = compiled({ ...data, ...templateData });

    if (outputPath) {
      const outputFilePath = path.join(this.outputDir, outputPath);
      await fs.mkdir(path.dirname(outputFilePath), { recursive: true });

      if (!this.shouldOverride) {
        try {
          const existingContent = await fs.readFile(outputFilePath, 'utf8');
          if (existingContent.includes(this.tableName)) {
            return content;
          }
          content = `${existingContent}\n${content}`;
        } catch (error) {}
      }

      await fs.writeFile(outputFilePath, content);
    }

    return content;
  }

  protected pascalCase(str: string): string {
    return str
      .split(/[-_\s]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }

  protected asWord(str: string): string {
    return str.replace(/([A-Z])/g, ' $1').trim();
  }

  protected capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  abstract generate(): Promise<void>;
}
