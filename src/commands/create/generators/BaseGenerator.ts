import { DatabaseType, DrizzleEngine, readConfig } from '@/utils/config';
import ejs from 'ejs';
import fs from 'fs/promises';
import path from 'path';
import { plural, singular } from 'pluralize';
import { fileURLToPath } from 'url';
import Answers from '../types/Answers';
import { Field } from '../types/Field';
import { asWord, capitalize, kebabCase, snakeCase } from '@/utils';
import { camelCase, pascalCase } from '@/utils';

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

  protected getTemplateData(): Record<string, any> {
    return {
      tableName: plural(camelCase(this.tableName)),
      TableName: pascalCase(singular(this.tableName)),
      fields: this.fields,
      TableWord: asWord(pascalCase(this.tableName)),
      adminDir: this.adminDir,
      database: this.database,
      singular: (str: string) => singular(str),
      plural: (str: string) => plural(str),
      asWord: asWord,
      kebabCase: kebabCase,
      snakeCase: snakeCase,
      camelCase: camelCase,
      capitalize: capitalize,
      pkType: this.answers.pkType,
    };
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

    const data = { ...this.getTemplateData(), ...templateData };

    let content = compiled(data);

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

  abstract generate(): Promise<void>;
}
