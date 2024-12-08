import chalk from 'chalk';
import inquirer from 'inquirer';
import DrizzleSchemaGenerator from './generators/Schema/DrizzleSchema';
import PrismaSchemaGenerator from './generators/Schema/PrismaSchema';
import FirebaseSchemaGenerator from './generators/Schema/FirebaseSchema';
import { DetailsPage, EditPage, Form, IndexPage, Actions } from './generators';
import Layout from './generators/Layout';
import NewPage from './generators/NewPage';
import Answers from './types/Answers';
import { Field } from './types/Field';
import Service from './generators/Service';
import BaseRepository from './generators/BaseRepository';
import Repository from './generators/Repository';
import RouteHandlerGenerator from './generators/RouteHandler';
import Exceptions from './generators/Exceptions';
import WithAuth from './generators/WithAuth';

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
  WithAuth,
];

export async function createCommand(
  tableName: string,
  rawFields: string[],
  options: { yes?: boolean }
) {
  console.log(chalk.green(`Creating table: ${tableName}`));
  
  const fields = rawFields
    .filter((field) => field.includes(':'))
    .map((field) => {
      const [name, type] = field.split(':');
      if (!name || !type) {
        console.log(chalk.red(`Invalid field format: ${field}. Skipping.`));
        return null;
      }
      return { name, type };
    })
    .filter((field): field is Field => field !== null);

  if (fields.length > 0) {
    console.log(chalk.blue('Fields:'));
    fields.forEach((field) => {
      console.log(chalk.yellow(`  ${field.name}: ${field.type}`));
    });
  } else {
    console.log(chalk.yellow('No valid fields provided.'));
    return;
  }

  let answers: Answers;
  if (options.yes) {
    answers = {
      serviceFile: true,
      apiRoutes: true,
      pkType: 'number'
    };
  } else {
    console.log('--------------------------------');
    answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'pkType',
        message: 'Select the primary key type:',
        choices: ['number', 'string'],
        default: 'number'
      },
      {
        type: 'confirm',
        name: 'serviceFile',
        message: 'Generate service file?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'apiRoutes',
        message: 'Generate API route handlers?',
        default: true,
      },
    ]);
  }

  await generateAll(tableName, fields, answers);
}

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
