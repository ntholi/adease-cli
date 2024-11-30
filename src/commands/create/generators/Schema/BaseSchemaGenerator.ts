import { BaseGenerator } from '../BaseGenerator';
import fs from 'fs/promises';
import path from 'path';

export abstract class BaseSchemaGenerator extends BaseGenerator {
  protected async appendToSchema(
    filePath: string,
    content: string
  ): Promise<void> {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });

    let existingContent = '';
    try {
      existingContent = await fs.readFile(filePath, 'utf8');
    } catch (error) {
      // File doesn't exist, that's fine
    }

    // Check if table already exists in schema
    if (existingContent.includes(this.tableName)) {
      return; // Skip if table already exists
    }

    // Append new content
    const newContent = existingContent
      ? `${existingContent}\n${content}`
      : content;
    await fs.writeFile(filePath, newContent);
  }
}
