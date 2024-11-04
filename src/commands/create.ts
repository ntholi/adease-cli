import { DetailsPage, EditPage, Form, IndexPage, Actions } from '../generators';
import Layout from '../generators/Layout';
import NewPage from '../generators/NewPage';
import Answers from '../types/Answers';
import { Field } from '../types/Field';

const generators = [
  DetailsPage,
  EditPage,
  Form,
  IndexPage,
  Actions,
  Layout,
  NewPage,
];

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
