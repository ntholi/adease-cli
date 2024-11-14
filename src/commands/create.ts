import DrizzleSchemaGenerator from '../generators/Schema/DrizzleSchema';
import PrismaSchemaGenerator from '../generators/Schema/PrismaSchema';
import FirebaseSchemaGenerator from '../generators/Schema/FirebaseSchema';
import { DetailsPage, EditPage, Form, IndexPage, Actions } from '../generators';
import Layout from '../generators/Layout';
import NewPage from '../generators/NewPage';
import Answers from '../types/Answers';
import { Field } from '../types/Field';
import Service from '../generators/Service';
import BaseRepository from '../generators/BaseRepository';
import Repository from '../generators/Repository';
import RouteHandlerGenerator from '../generators/RouteHandler';
import Exceptions from '../generators/Exceptions';

const generators = [
  DrizzleSchemaGenerator,
  PrismaSchemaGenerator,
  FirebaseSchemaGenerator,
  DetailsPage,
  EditPage,
  Form,
  IndexPage,
  Actions,
  Layout,
  NewPage,
  Service,
  BaseRepository,
  Repository,
  RouteHandlerGenerator,
  Exceptions,
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
