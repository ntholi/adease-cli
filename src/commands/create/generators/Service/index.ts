import { baseDir } from '@/utils/config';
import Answers from '../../types/Answers';
import { Field } from '../../types/Field';
import { BaseGenerator } from '../BaseGenerator';

class ServiceGenerator extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers);
  }

  async generate(): Promise<void> {
    if (!this.answers.serviceFile) return;

    await this.compile(
      `Service/${this.database}.service.ejs`,
      `${this.tableName}/service.ts`
    );
  }

  protected getOutputDir(): string {
    return baseDir('server');
  }
}

export default ServiceGenerator;
