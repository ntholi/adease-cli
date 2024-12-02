import { baseDir } from '@/utils/config';
import Answers from '../../types/Answers';
import { Field } from '../../types/Field';
import { BaseGenerator } from '../BaseGenerator';

class RouteHandlerGenerator extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers, 'skip');
  }

  async generate(): Promise<void> {
    if (!this.answers.apiRoutes) return;

    const templatePrefix = this.answers.serviceFile ? 'service' : 'repository';

    await this.compile(
      `RouteHandler/template.${templatePrefix}.ejs`,
      'route.ts'
    );

    await this.compile(
      `RouteHandler/id-template.${templatePrefix}.ejs`,
      '[id]/route.ts'
    );
  }

  protected getOutputDir(): string {
    return baseDir(`/app/api/${this.tableName}`);
  }
}

export default RouteHandlerGenerator;
