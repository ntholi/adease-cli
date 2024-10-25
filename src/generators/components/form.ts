import { Property } from '../../types';
import { capitalize, plural, singular, wordSpace } from '../../utils/word';

function generateForm(tableName: string, properties: Property[]): string {
  const capitalized = capitalize(singular(tableName));
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

type ${capitalized} = typeof ${plural(tableName)}.$inferInsert;

type Props = {
  onSubmit: (values: ${capitalized}) => Promise<${capitalized}>;
  defaultValues?: ${capitalized};
};

export default function ${capitalized}Form({ onSubmit, defaultValues }: Props) {
  return (
    <Form action={onSubmit} schema={createInsertSchema(${plural(
      tableName
    )})} defaultValues={defaultValues}>
      ${formFields}
    </Form>
  );
}`;
}

export { generateForm };
