import chalk from 'chalk';
import { Command } from 'commander';
import { Field } from './types/Field';
import Answers from './types/Answers';
import { generateAll } from './commands/create';
import inquirer from 'inquirer';

const program = new Command();

program
  .version('0.0.1-alpha.0')
  .description('Adease CLI tool for creating tables');

program
  .command('create')
  .description('Create a new table with specified fields')
  .argument('<tableName>', 'Name of the table to create')
  .argument('[fields...]', 'Fields in the format fieldName:fieldType')
  .action(async (tableName: string, rawFields: string[]) => {
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

    const answers: Answers = await inquirer.prompt([
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

    await generateAll(tableName, fields, answers);
  });

program.parse(process.argv);
