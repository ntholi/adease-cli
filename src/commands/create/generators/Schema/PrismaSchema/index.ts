import Answers from '../../../types/Answers';
import { Field } from '../../../types/Field';
import { BaseSchemaGenerator } from '../BaseSchemaGenerator';

class PrismaSchemaGenerator extends BaseSchemaGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers, 'append', 'prisma');
  }

  private mapFieldType(type: string): string {
    switch (type.toLowerCase()) {
      case 'string':
        return 'String';
      case 'number':
        return 'Int';
      case 'boolean':
        return 'Boolean';
      case 'date':
        return 'DateTime';
      case 'float':
        return 'Float';
      case 'bigint':
        return 'BigInt';
      default:
        return 'String';
    }
  }

  async generate(): Promise<void> {
    if (this.database !== 'prisma') return;

    const mappedFields = this.fields.map((field) => ({
      ...field,
      type: this.mapFieldType(field.type),
    }));

    await this.compile('Schema/PrismaSchema/template.ejs', 'schema.prisma', {
      fields: mappedFields,
    });
  }
}

export default PrismaSchemaGenerator;
