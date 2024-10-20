import { Command } from 'commander';
import chalk from 'chalk';

interface Property {
  name: string;
  type: string;
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
  .action((tableName: string, properties: string[]) => {
    console.log(chalk.green('Creating table'), chalk.yellow(tableName));

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
    }
    console.log(chalk.green('Table created successfully!'));
  });

program.parse(process.argv);
