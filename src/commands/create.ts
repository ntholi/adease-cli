import DetailsPage from '../generators/DetailsPage';
import FormGenerator from '../generators/Form';
import Answers from '../types/Answers';
import { Field } from '../types/Field';

const generators = [FormGenerator];

export async function generateAll(
  tableName: string,
  fields: Field[],
  answers: Answers
) {
  for (const generator of generators) {
    const instance = new generator(tableName, fields, answers);
    await instance.generate();
  }
}
