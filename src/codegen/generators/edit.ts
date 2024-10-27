import { capitalize, singular } from '../../utils/word';

export function generateEditPage(tableName: string): string {
  const typeName = capitalize(singular(tableName));
  return `import { Box } from '@mantine/core';
import { notFound } from 'next/navigation';
import Form from '../../form';
import { get${typeName}, update${typeName} } from '../../actions';

type Props = {
  params: {
    id: string;
  };
};

export default async function EditPage({ params }: Props) {
  const { id } = await params;
  const item = await get${typeName}(Number(id));
  if (!item) return notFound();
  
  return (
    <Box p={'lg'}>
      <Form
        defaultValues={item}
        onSubmit={async (value) => {
          'use server';
          return await update${typeName}(Number(id), value);
        }}
      />
    </Box>
  );
}`;
}
