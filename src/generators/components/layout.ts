import { singular } from '../../utils/word';

export function generateLayout(tableName: string): string {
  const service = `${singular(tableName)}Service`;

  return `import { PropsWithChildren } from 'react';
import {ListItem, ListLayout} from 'adease';
import { ${service} } from '@/server/${tableName}/service';


export default function Layout({ children }: PropsWithChildren) {
  return (
    <ListLayout
      getItems={${service}.search}
      renderItem={(it) => <ListItem id={it.id} label={it.id} />}
    >
      {children}
    </ListLayout>
  );
}`;
}
