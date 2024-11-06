import path from 'path';
import { fileURLToPath } from 'url';
import { BaseSchemaGenerator } from '../BaseSchemaGenerator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PrismaSchemaGenerator extends BaseSchemaGenerator {
  async generate(): Promise<void> {
    if (this.answers.database !== 'prisma') return;

    const content = await this.compile(
      path.join(__dirname, 'template.ejs'),
      '',
      { fields: this.fields }
    );

    await this.appendToSchema(
      path.join(process.cwd(), 'prisma', 'schema.prisma'),
      content
    );
  }
}

export default PrismaSchemaGenerator;
