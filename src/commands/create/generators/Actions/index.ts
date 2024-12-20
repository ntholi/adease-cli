import { baseDir } from '@/utils/config';
import Answers from '../../types/Answers';
import { Field } from '../../types/Field';
import { BaseGenerator } from '../BaseGenerator';

class ActionsGenerator extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers);
  }

  async generate(): Promise<void> {
    const templateFile = this.answers.serviceFile
      ? 'service.ejs'
      : 'repository.ejs';

    await this.compile(
      `Actions/${templateFile}`,
      `${this.tableName}/actions.ts`,
      {}
    );
  }

  protected getOutputDir(): string {
    return baseDir('server');
  }
}

export default ActionsGenerator;
