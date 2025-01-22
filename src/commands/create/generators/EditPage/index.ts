import { baseDir } from '@/utils/config';
import Answers from '../../types/Answers';
import { Field } from '../../types/Field';
import { BaseGenerator } from '../BaseGenerator';
import { kebabCase } from '@/utils';

class EditPageGenerator extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers, 'skip');
  }

  async generate(): Promise<void> {
    const templateName = `EditPage/${this.database}.template.ejs`;
    await this.compile(
      templateName,
      `${kebabCase(this.tableName)}/[id]/page.tsx`
    );
  }

  protected getOutputDir(): string {
    return baseDir('app');
  }
}

export default EditPageGenerator;
