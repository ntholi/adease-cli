import { capitalize } from '../../utils/word';

export function generateLayout(tableName: string): string {
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
