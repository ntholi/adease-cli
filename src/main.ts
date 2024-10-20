import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

program
  .version('1.0.0')
  .description('Adease CLI tool')
  .option('-n, --name <name>', 'Your name')
  .option('-g, --greet', 'Greet the user')
  .parse(process.argv);

const options = program.opts();

if (options.greet) {
  const name = options.name || 'User';
  console.log(chalk.green(`Hello, ${name}! Welcome to Adease CLI.`));
} else {
  console.log(chalk.yellow('Use --help to see available commands'));
}
