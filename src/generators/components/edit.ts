import { singular } from '../../utils/word';

export function generateEditPage(tableName: string): string {
  const service = `${singular(tableName)}Service`;
  return `import { Box } from '@mantine/core';
import { notFound } from 'next/navigation';
import Form from '../../form';
import { ${service} } from '@/server/${tableName}/service';

type Props = {
  params: {
    id: string;
  };
};

export default async function EditPage({ params }: Props) {
  const { id } = await params;
  const item = await ${service}.get(Number(id));
  if (!item) return notFound();
  
  return (
    <Box p={'lg'}>
      <Form
        defaultValues={item}
        onSubmit={async (value) => {
          'use server';
          return await ${service}.update(Number(id), value);
        }}
      />
    </Box>
  );
}`;
}
