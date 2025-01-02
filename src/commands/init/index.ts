import inquirer from 'inquirer';
import { DatabaseType, DrizzleEngine, writeConfig } from '../../utils/config';
import ComponentsGenerator from './generators/Components';
import chalk from 'chalk';
import RootIndexGenerator from './generators/RootIndex';
import HooksGenerator from './generators/Hooks';

export const INIT_DESTINATION_DIR = 'Init';

export async function init(options: { yes?: boolean }) {
  let baseDir: string;
  let adminDir: string;
  let databaseType: DatabaseType | null = null;
  let databaseEngine: DrizzleEngine | undefined;

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
    ]);

    databaseType = answers.database;

    if (databaseType === 'drizzle') {
      const engineAnswers = await inquirer.prompt([
        {
          type: 'list',
          name: 'databaseEngine',
          message: 'Which database engine would you like to use?',
          choices: [
            { name: 'PostgreSQL', value: 'postgresql' },
            { name: 'SQLite', value: 'sqlite' },
          ],
          default: 'postgresql',
        },
      ]);
      databaseEngine = engineAnswers.databaseEngine;
    }

    const dirAnswers = await inquirer.prompt([
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

    baseDir = dirAnswers.baseDir;
    adminDir = dirAnswers.adminDir;
  }

  const database = databaseType
    ? { type: databaseType, engine: databaseEngine }
    : null;

  writeConfig({ baseDir, adminDir, database });
  console.log(chalk.green('Configuration file created successfully!'));

  await new ComponentsGenerator().generate();
  await new HooksGenerator().generate();
  console.log(chalk.green('Component files generated successfully!'));

  await new RootIndexGenerator().generate();
}
