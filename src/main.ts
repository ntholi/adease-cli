import { Command } from 'commander';
import { createCommand } from './commands/create';
import { init } from './commands/init';

const program = new Command();

program
  .version('0.0.1-alpha.0')
  .description('Adease CLI tool for creating tables');

program
  .command('create')
  .description('Create a new table with specified fields')
  .argument('<tableName>', 'Name of the table to create')
  .argument('[fields...]', 'Fields in the format fieldName:fieldType')
  .option('-y, --yes', 'Skip all prompts and use default values')
  .action(createCommand);

program
  .command('init')
  .description('Initialize Adease configuration')
  .option('-y, --yes', 'Use default values')
  .action(async (options: { yes?: boolean }) => {
    await init(options);
  });

program.parse(process.argv);
