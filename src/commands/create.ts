import IndexPage from '../generators/IndexPage';
import Answers from '../types/Answers';
const generators = [IndexPage];

export async function generateAll(answers: Answers) {
  for (const generator of generators) {
    const instance = new generator(answers);
    await instance.generate();
  }
}
