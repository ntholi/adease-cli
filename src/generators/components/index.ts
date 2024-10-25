import fs from 'fs/promises';
import path from 'path';
import { Property } from '../../types';
import { generateDetailsPage } from './details';
import { generateEditPage } from './edit';
import { generateForm } from './form';
import { generateLayout } from './layout';
import { generateMainPage } from './mainPage';
import { generateNewPage } from './new';
import { generateBaseRepository, generateRepository } from './repository';

export async function generateFiles(tableName: string, properties: Property[]) {
  const files = [
    {
      path: `src/app/${tableName}/page.tsx`,
      content: generateMainPage(tableName),
    },
    {
      path: `src/app/${tableName}/layout.tsx`,
      content: generateLayout(tableName),
    },
    {
      path: `src/app/${tableName}/form.tsx`,
      content: generateForm(tableName, properties),
    },
    {
      path: `src/app/${tableName}/[id]/page.tsx`,
      content: generateDetailsPage(tableName, properties),
    },
    {
      path: `src/app/${tableName}/[id]/edit/page.tsx`,
      content: generateEditPage(tableName),
    },
    {
      path: `src/app/${tableName}/new/page.tsx`,
      content: generateNewPage(tableName),
    },
    {
      path: `src/server/${tableName}/repository.ts`,
      content: generateRepository(tableName),
    },
  ];

  await generateBaseRepository();
  for (const file of files) {
    await fs.mkdir(path.dirname(file.path), { recursive: true });
    await fs.writeFile(file.path, file.content);
  }
}
