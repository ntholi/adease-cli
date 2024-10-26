import { capitalize, singular } from '../../utils/word';

export function generateLayout(tableName: string): string {
  const typeName = capitalize(singular(tableName));

  return `import { PropsWithChildren } from 'react';
import { ListItem, ListLayout } from 'adease';
import { getAll${typeName}s } from './actions';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <ListLayout
      getItems={getAll${typeName}s}
      renderItem={(it) => <ListItem id={it.id} label={it.id} />}
    >
      {children}
    </ListLayout>
  );
}`;
}
