import fs from 'fs/promises';
import path from 'path';

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
  return `'use client';
import { PropsWithChildren } from 'react';
import { get${capitalizeFirstLetter(tableName)} } from './actions';
import {ListItem, ListLayout} from 'adease';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <ListLayout
      getItems={get${capitalizeFirstLetter(tableName)}}
      path='/admin/${tableName}'
      navigate={(path) => {
        router.push(path);
      }}
      renderItem={(item, path) => (
        <ListItem
          label={item.id}
          description={item.name || ''}
          id={item.id}
          path={path}
        />
      )}
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
  const capitalizedTableName = capitalizeFirstLetter(tableName);
  const formFields = properties
    .map((prop) => {
      const inputType =
        prop.type.toLowerCase() === 'number' ? 'NumberInput' : 'TextInput';
      return `<${inputType} name='${prop.name}' label='${capitalizeFirstLetter(
        prop.name
      )}' />`;
    })
    .join('\n      ');

  return `'use client';
import { ${tableName} } from '@/db/schema';
import {FormHeader, Form} from 'adease';
import { NumberInput, TextInput } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';

type ${capitalizedTableName} = typeof ${tableName}.$inferSelect;

type Props = {
  value?: ${capitalizedTableName};
  onSubmit: (values: ${capitalizedTableName}) => Promise<${capitalizedTableName}>;
};

const ${capitalizedTableName}Schema = createInsertSchema(${tableName})

export default function Form({ onSubmit, value }: Props) {
  return (
    <Form>
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
        `<FieldView label='${capitalizeFirstLetter(prop.name)}'>{item.${
          prop.name
        }}</FieldView>`
    )
    .join('\n        ');

  return `import {DeleteIconButton, FieldView, HeaderDisplay} from 'adease';
import { Anchor, Box, Stack } from '@mantine/core';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { delete${capitalizeFirstLetter(tableName)}, get${capitalizeFirstLetter(
    tableName
  )} } from '../actions';

type Props = {
  params: {
    id: string | number;
  };
};
export default async function Page({ params: { id } }: Props) {
  const item = await get${capitalizeFirstLetter(tableName)}(id);
  if (!item) {
    return notFound();
  }

  return (
    <Box p={'lg'}>
      <HeaderDisplay
        title={item.name || item.id.toString()}
        actionButtons={[<DeleteIconButton action={delete${capitalizeFirstLetter(
          tableName
        )}} id={id} />]}
      />

      <Stack p={'xl'}>
        ${fieldViews}
      </Stack>
    </Box>
  );
}`;
}

function generateEditPageContent(tableName: string): string {
  const capitalizedTableName = capitalizeFirstLetter(tableName);
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
  const capitalizedTableName = capitalizeFirstLetter(tableName);
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

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
