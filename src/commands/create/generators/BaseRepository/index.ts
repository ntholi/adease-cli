import { BaseGenerator } from '../BaseGenerator';
import Answers from '../../types/Answers';
import { baseDir } from '@/utils/config';
import { Field } from '../../types/Field';

class BaseRepositoryGenerator extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers, 'skip', baseDir('repositories'));
  }

  async generate(): Promise<void> {
    await this.compile('BaseRepository/template.ejs', 'BaseRepository.ts');
  }
}

export default BaseRepositoryGenerator;
