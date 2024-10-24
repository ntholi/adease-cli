export function generateMainPage(tableName: string): string {
  return `import {NothingSelected} from 'adease';

export default function Page() {
  return <NothingSelected title='${tableName}' />;
}`;
}
