import Answers from '../../types/Answers';
import { BaseGenerator } from '../BaseGenerator';
import { Field } from '../../types/Field';
import { baseDir } from '@/utils/config';

class RouteHandlerGenerator extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers, 'skip', baseDir('/app/api/'));
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
}

export default RouteHandlerGenerator;
