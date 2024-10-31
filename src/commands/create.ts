import { DetailsPage, EditPage, Form, IndexPage } from '../generators';
import Answers from '../types/Answers';
import { Field } from '../types/Field';

const generators = [DetailsPage, EditPage, Form, IndexPage];

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
