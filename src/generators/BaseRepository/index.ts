import Answers from '../../types/Answers';
import { BaseGenerator } from '../BaseGenerator';
import { Field } from '../../types/Field';
import { baseDir } from '../../utils/config';

class BaseRepositoryGenerator extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers, 'skip', baseDir('lib'));
  }

  async generate(): Promise<void> {
    await this.compile('BaseRepository/template.ejs', 'BaseRepository.ts');
  }
}

export default BaseRepositoryGenerator;
