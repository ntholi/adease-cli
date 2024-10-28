import Answers from '../../types/Answers';
import { BaseGenerator } from '../BaseGenerator';

class IndexPageGenerator extends BaseGenerator {
  constructor(answers: Answers) {
    super(answers);
  }

  async generate(): Promise<void> {
    await this.generateFile('template.ejs', 'index.ts');
  }
}

export default IndexPageGenerator;
