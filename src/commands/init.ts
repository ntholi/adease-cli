import inquirer from 'inquirer';
import { writeConfig } from '../utils/config';
import ComponentsGenerator from '../generators/Components';
import chalk from 'chalk';

export async function init(options: { yes?: boolean }) {
  let baseDir: string;
  let adminDir: string;

  if (options.yes) {
    baseDir = 'src';
    adminDir = 'admin';
  } else {
    const answers = await inquirer.prompt([
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
  }

  writeConfig({ baseDir, adminDir });
  console.log(chalk.green('Configuration file created successfully!'));

  // Generate component files
  const generator = new ComponentsGenerator();
  await generator.generate();
  console.log(chalk.green('Component files generated successfully!'));
}
