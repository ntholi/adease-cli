import { capitalize } from '../../utils/word';

export function generateEditPage(tableName: string): string {
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
