import { BaseGenerator } from '../../BaseGenerator';
import { Field } from '../../../types/Field';
import Answers from '../../../types/Answers';

class PrismaSchemaGenerator extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers, 'append');
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
    if (this.answers.database !== 'prisma') return;

    const mappedFields = this.fields.map((field) => ({
      ...field,
      type: this.mapFieldType(field.type),
    }));

    await this.compile(
      'Schema/PrismaSchema/template.ejs',
      '../../prisma/schema.prisma',
      { fields: mappedFields }
    );
  }
}

export default PrismaSchemaGenerator;
