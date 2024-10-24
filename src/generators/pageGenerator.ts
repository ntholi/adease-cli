import fs from 'fs/promises';
import path from 'path';
import { capitalize, singular, wordSpace } from '../utils/word';

interface Property {
  name: string;
  type: string;
}

export async function generateFiles(tableName: string, properties: Property[]) {
  const files = [
    {
      path: `src/app/${tableName}/page.tsx`,
      content: generatePageContent(tableName),
    },
    {
      path: `src/app/${tableName}/layout.tsx`,
      content: generateLayoutContent(tableName),
    },
    {
      path: `src/app/${tableName}/form.tsx`,
      content: generateFormContent(tableName, properties),
    },
    {
      path: `src/app/${tableName}/[id]/page.tsx`,
      content: generateIdPageContent(tableName, properties),
    },
    {
      path: `src/app/${tableName}/[id]/edit/page.tsx`,
      content: generateEditPageContent(tableName),
    },
    {
      path: `src/app/${tableName}/new/page.tsx`,
      content: generateNewPageContent(tableName),
    },
  ];

  for (const file of files) {
    await fs.mkdir(path.dirname(file.path), { recursive: true });
    await fs.writeFile(file.path, file.content);
  }
}

function generatePageContent(tableName: string): string {
  return `import {NothingSelected} from 'adease';

export default function Page() {
  return <NothingSelected title='${tableName}' />;
}`;
}

function generateLayoutContent(tableName: string): string {
  return `import { PropsWithChildren } from 'react';
import { get${capitalize(tableName)} } from './actions';
import {ListItem, ListLayout} from 'adease';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <ListLayout
      getItems={get${capitalize(tableName)}}
      renderItem={(it) => <ListItem id={it.id} label={it.id} />}
    >
      {children}
    </ListLayout>
  );
}`;
}

function generateFormContent(
  tableName: string,
  properties: Property[]
): string {
  const capitalizedTableName = capitalize(tableName);
  const formFields = properties
    .map((prop) => {
      const inputType =
        prop.type.toLowerCase() === 'number' ? 'NumberInput' : 'TextInput';
      return `<${inputType} name='${prop.name}' label='${capitalize(
        prop.name
      )}' />`;
    })
    .join('\n      ');

  return `'use client';
import { ${tableName} } from '@/db/schema';
import { Form} from 'adease';
import { NumberInput, TextInput } from '@mantine/core';
import { createInsertSchema } from 'drizzle-zod';

type ${capitalizedTableName} = typeof ${tableName}.$inferSelect;

type Props = {
  onSubmit: (values: ${capitalizedTableName}) => Promise<${capitalizedTableName}>;
};

const ${capitalizedTableName}Schema = createInsertSchema(${tableName})

export default function ${capitalizedTableName}Form({ onSubmit }: Props) {
  return (
    <Form action={onSubmit} schema={${capitalizedTableName}Schema}>
      ${formFields}
    </Form>
  );
}`;
}

function generateIdPageContent(
  tableName: string,
  properties: Property[]
): string {
  const fieldViews = properties
    .map(
      (prop) =>
        `<FieldView label='${capitalize(wordSpace(prop.name))}'>{item.${
          prop.name
        }}</FieldView>`
    )
    .join('\n        ');

  return `import {
  DetailsView,
  DetailsViewHeader,
  FieldView,
  DetailsViewBody,
} from 'adease';
import { notFound } from 'next/navigation';
import { delete${capitalize(singular(tableName))}, get${capitalize(
    singular(tableName)
  )} } from '../actions';

type Props = {
  params: {
    id: string | number;
  };
};
export default async function Page({ params }: Props) {
  const { id } = await params;
  const item = await get${capitalize(singular(tableName))}(id);
  if (!item) {
    return notFound();
  }

  return (
    <DetailsView>
      <DetailsViewHeader
        id={id}
        title={item.id.toString()}  
        handleDelete={delete${capitalize(singular(tableName))}}
      />
      <DetailsViewBody>
        ${fieldViews}
      </DetailsViewBody>
    </DetailsView>
  );
}`;
}

function generateEditPageContent(tableName: string): string {
  const capitalizedTableName = capitalize(tableName);
  return `import { Box } from '@mantine/core';
import { notFound } from 'next/navigation';
import Form from '../../form';
import { get${capitalizedTableName}, update${capitalizedTableName} } from '../../actions';

type Props = {
  params: {
    id: string;
  };
};

export default async function EditPage({ params: { id } }: Props) {
  const item = await get${capitalizedTableName}(id);
  if (!item) return notFound();

  return (
    <Box p={'lg'}>
      <Form
        value={item}
        onSubmit={async (value) => {
          'use server';
          return await update${capitalizedTableName}(id, value);
        }}
      />
    </Box>
  );
}`;
}

function generateNewPageContent(tableName: string): string {
  const capitalizedTableName = capitalize(tableName);
  return `import { Box } from '@mantine/core';
import Form from '../form';
import { create${capitalizedTableName} } from '../actions';

export default async function NewPage() {
  return (
    <Box p={'lg'}>
      <Form onSubmit={create${capitalizedTableName}} />
    </Box>
  );
}`;
}
