import { Property } from '../../types';
import { capitalize, plural, wordSpace } from '../../utils/word';

function generateForm(tableName: string, properties: Property[]): string {
  const capitalized = capitalize(plural(tableName));
  const formFields = properties
    .map((prop) => {
      const inputType =
        prop.type.toLowerCase() === 'number' ? 'NumberInput' : 'TextInput';
      return `<${inputType} name='${prop.name}' label='${capitalize(
        wordSpace(prop.name)
      )}' />`;
    })
    .join('\n      ');

  return `'use client';
import { ${plural(tableName)} } from '@/db/schema';
import { Form} from 'adease';
import { NumberInput, TextInput } from '@mantine/core';
import { createInsertSchema } from 'drizzle-zod';

type ${capitalized} = typeof ${plural(tableName)}.$inferSelect;

type Props = {
  onSubmit: (values: ${capitalized}) => Promise<${capitalized}>;
};

const ${capitalized}Schema = createInsertSchema(${plural(tableName)})

export default function ${capitalized}Form({ onSubmit }: Props) {
  return (
    <Form action={onSubmit} schema={${capitalized}Schema}>
      ${formFields}
    </Form>
  );
}`;
}

export { generateForm };
