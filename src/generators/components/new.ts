import { singular } from '../../utils/word';

export function generateNewPage(tableName: string): string {
  const service = `${singular(tableName)}Service`;
  return `import { Box } from '@mantine/core';
import Form from '../form';
import { ${service} } from '@/server/${tableName}/service';


export default async function NewPage() {
  return (
    <Box p={'lg'}>
      <Form onSubmit={${service}.create} />
    </Box>
  );
}`;
}
