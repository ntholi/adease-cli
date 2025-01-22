import { Field } from '../types/Field';
import Answers from '../types/Answers';
import BaseRepositoryGenerator from './BaseRepository';
import RepositoryGenerator from './Repository';
import ServiceGenerator from './Service';
import WithAuth from './WithAuth';
import SchemaGenerator from './Schema/DrizzleSchema';
import FormGenerator from './Form';
import EditPageGenerator from './EditPage';
import DetailsPageGenerator from './DetailsPage';
import ActionsGenerator from './Actions';

export const generators = [
  BaseRepositoryGenerator,
  RepositoryGenerator,
  ServiceGenerator,
  WithAuth,
  SchemaGenerator,
  FormGenerator,
  EditPageGenerator,
  DetailsPageGenerator,
  ActionsGenerator,
];

export async function generate(
  tableName: string,
  fields: Field[],
  answers: Answers
) {
  for (const Generator of generators) {
    const generator = new Generator(tableName, fields, answers);
    await generator.generate();
  }
}

export { default as DetailsPage } from './DetailsPage';
export { default as EditPage } from './EditPage';
export { default as Form } from './Form';
export { default as IndexPage } from './IndexPage';
export { default as Actions } from './Actions';
