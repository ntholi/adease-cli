import path from 'path';
import { fileURLToPath } from 'url';
import { BaseSchemaGenerator } from '../BaseSchemaGenerator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FirebaseSchemaGenerator extends BaseSchemaGenerator {
  async generate(): Promise<void> {
    if (this.answers.database !== 'firebase') return;

    const content = await this.compile(
      path.join(__dirname, 'template.ejs'),
      ''
    );

    await this.appendToSchema(
      path.join(process.cwd(), this.tableName + '.ts'),
      content
    );
  }
}

export default FirebaseSchemaGenerator;
