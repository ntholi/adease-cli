import { capitalize, singular } from '../../utils/word';

export function generateNewPage(tableName: string): string {
  const typeName = capitalize(singular(tableName));
  return `import { Box } from '@mantine/core';
import Form from '../form';
import { create${typeName} } from '../actions';

export default async function NewPage() {
  return (
    <Box p={'lg'}>
      <Form onSubmit={create${typeName}} />
    </Box>
  );
}`;
}
