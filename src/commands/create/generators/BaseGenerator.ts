import path from 'path';
import Answers from '../types/Answers';
import fs from 'fs/promises';
import ejs from 'ejs';
import { Field } from '../types/Field';
import pluralize from 'pluralize';
import { fileURLToPath } from 'url';
import { DatabaseType, DrizzleEngine, readConfig } from '@/utils/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DESTINATION_DIR = 'Create';

export abstract class BaseGenerator {
  protected readonly baseDir: string;
  protected readonly adminDir: string;
  protected readonly database: DatabaseType | null;
  protected readonly databaseEngine?: DrizzleEngine;
  protected readonly outputDir: string;

  constructor(
    protected readonly tableName: string,
    protected readonly fields: Field[],
    protected readonly answers: Answers,
    protected readonly overrideMode: 'override' | 'append' | 'skip' = 'skip',
    outputDir: string = ''
  ) {
    const config = readConfig();
    this.baseDir = config.baseDir;
    this.adminDir = config.adminDir;
    this.database = config.database?.type || null;
    this.databaseEngine = config.database?.engine;
    this.outputDir = outputDir || this.getOutputDir();
  }

  protected getOutputDir(): string {
    return path.join(
      process.cwd(),
      this.baseDir,
      'app',
      this.adminDir,
      this.tableName
    );
  }

  protected async compile(
    templatePath: string,
    outputPath: string,
    templateData?: Record<string, any>
  ): Promise<string> {
    const template = await fs.readFile(
      path.join(__dirname, `${DESTINATION_DIR}/${templatePath}`),
      'utf8'
    );
    const compiled = ejs.compile(template);

    const data = {
      tableName: pluralize.plural(this.tableName),
      TableName: this.pascalCase(pluralize.singular(this.tableName)),
      fields: this.fields,
      TableWord: this.pascalCase(this.asWord(this.tableName)),
      adminDir: this.adminDir,
      database: this.database,
      capitalize: this.capitalize,
      singular: (str: string) => pluralize.singular(str),
      plural: (str: string) => pluralize.plural(str),
      asWord: this.asWord,
    };

    let content = compiled({ ...data, ...templateData });

    if (outputPath) {
      const outputFilePath = path.join(this.outputDir, outputPath);
      await fs.mkdir(path.dirname(outputFilePath), { recursive: true });

      if (this.overrideMode === 'append') {
        try {
          const existingContent = await fs.readFile(outputFilePath, 'utf8');
          if (existingContent.includes(this.tableName)) {
            return content;
          }
          content = `${existingContent}\n${content}`;
        } catch (error) {}
      } else if (this.overrideMode === 'skip') {
        try {
          await fs.access(outputFilePath);
          return content;
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
