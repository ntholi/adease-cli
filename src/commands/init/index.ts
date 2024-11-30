import inquirer from 'inquirer';
import { DatabaseType, writeConfig } from '../../utils/config';
import ComponentsGenerator from './generators/Components';
import chalk from 'chalk';
import RootIndexGenerator from './generators/RootIndex';

export async function init(options: { yes?: boolean }) {
  let baseDir: string;
  let adminDir: string;
  let database: DatabaseType | null = null;

  if (options.yes) {
    baseDir = 'src';
    adminDir = 'admin';
  } else {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'database',
        message: 'Which database adapter would you like to use?',
        choices: [
          { name: 'Drizzle', value: 'drizzle' },
          { name: 'Prisma', value: 'prisma' },
          { name: 'Firebase', value: 'firebase' },
          { name: 'None', value: null },
        ],
        default: 'drizzle',
      },
      {
        type: 'input',
        name: 'baseDir',
        message: 'What is your base directory?',
        default: 'src',
      },
      {
        type: 'input',
        name: 'adminDir',
        message: 'What is your admin directory?',
        default: 'admin',
      },
    ]);

    baseDir = answers.baseDir;
    adminDir = answers.adminDir;
    database = answers.database;
  }

  writeConfig({ baseDir, adminDir, database });
  console.log(chalk.green('Configuration file created successfully!'));

  const generator = new ComponentsGenerator();
  await generator.generate();
  console.log(chalk.green('Component files generated successfully!'));

  await new RootIndexGenerator().generate();
}
