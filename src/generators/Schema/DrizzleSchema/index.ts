import path from 'path';
import { fileURLToPath } from 'url';
import { BaseSchemaGenerator } from '../BaseSchemaGenerator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DrizzleSchemaGenerator extends BaseSchemaGenerator {
  async generate(): Promise<void> {
    if (this.answers.database !== 'drizzle') return;

    const content = await this.compile(
      path.join(__dirname, 'template.ejs'),
      '',
      { fields: this.fields }
    );

    await this.appendToSchema(
      path.join(process.cwd(), 'db', 'schema', 'index.ts'),
      content
    );
  }
}

export default DrizzleSchemaGenerator;
