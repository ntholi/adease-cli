import fs from 'fs/promises';
import { BaseGenerator } from '../BaseGenerator';
import path from 'path';
import pluralize from 'pluralize';

export abstract class BaseSchemaGenerator extends BaseGenerator {
  protected async compile(
    templatePath: string,
    outputPath: string,
    templateData?: Record<string, any>
  ): Promise<string> {
    let existingContent = '';
    try {
      existingContent = await fs.readFile(
        path.join(this.outputDir, outputPath),
        'utf8'
      );
    } catch (error) {}

    const TableName = this.pascalCase(pluralize.singular(this.tableName));
    if (
      [this.tableName, TableName].some((it) => existingContent.includes(it))
    ) {
      console.warn(
        `Schema for table ${this.tableName} already defined, skipping.`
      );
      return '';
    }

    return await super.compile(templatePath, outputPath, templateData);
  }
}
