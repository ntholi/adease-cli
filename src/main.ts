import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { handleSchema } from './schemaHandler';

interface Property {
  name: string;
  type: string;
}

interface Answers {
  generateServiceFile: boolean;
  runMigration: boolean;
}

const program = new Command();

program
  .version('0.0.1-alpha.0')
  .description('Adease CLI tool for creating tables');

program
  .command('create')
  .description('Create a new table with specified properties')
  .argument('<tableName>', 'Name of the table to create')
  .argument('[properties...]', 'Properties in the format propertyName:dataType')
  .action(async (tableName: string, properties: string[]) => {
    console.log(chalk.green(`Creating table: ${tableName}`));

    const parsedProperties: Property[] = properties
      .filter((prop) => prop.includes(':'))
      .map((prop) => {
        const [name, type] = prop.split(':');
        if (!name || !type) {
          console.log(chalk.red(`Invalid property format: ${prop}. Skipping.`));
          return null;
        }
        return { name, type };
      })
      .filter((prop): prop is Property => prop !== null);

    if (parsedProperties.length > 0) {
      console.log(chalk.blue('Properties:'));
      parsedProperties.forEach((prop) => {
        console.log(chalk.yellow(`  ${prop.name}: ${prop.type}`));
      });
    } else {
      console.log(chalk.yellow('No valid properties provided.'));
      return;
    }

    const answers: Answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'generateServiceFile',
        message: 'Generate service file?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'runMigration',
        message: 'Run migration?',
        default: true,
      },
    ]);

    console.log(chalk.blue('You chose to:'));
    console.log(
      chalk.yellow(`  Generate service file: ${answers.generateServiceFile}`)
    );
    console.log(chalk.yellow(`  Run migration: ${answers.runMigration}`));

    try {
      await handleSchema(tableName, parsedProperties);
      console.log(chalk.green('Schema updated successfully!'));
    } catch (error) {
      console.error(chalk.red('Error updating schema:'), error);
    }

    if (answers.generateServiceFile) {
      console.log(chalk.green('Service file generated. (placeholder)'));
    }
    if (answers.runMigration) {
      console.log(chalk.green('Migration run successfully. (placeholder)'));
    }
  });

program.parse(process.argv);
