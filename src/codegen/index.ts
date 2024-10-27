import fs from 'fs/promises';
import path from 'path';
import { Property } from '../types';
import { generateDetailsPage } from './generators/details';
import { generateEditPage } from './generators/edit';
import { generateForm } from './generators/form';
import { generateLayout } from './generators/layout';
import { generateMainPage } from './generators/mainPage';
import { generateNewPage } from './generators/new';
import {
  generateBaseRepository,
  generateRepository,
} from './generators/repository';
import { generateService } from './generators/service';
import { Answers } from 'inquirer';
import { generateActions } from './generators/actions';
import { generateWithAuthFile } from './generators/withAuth';
import { generateRouteHandlers } from './generators/route';

export async function generateFiles(
  tableName: string,
  properties: Property[],
  answers: Answers
) {
  const hasServiceFile = answers.generateServiceFile;
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
      path: `src/app/${tableName}/actions.ts`,
      content: generateActions(tableName, hasServiceFile),
    },
    {
      path: `src/server/${tableName}/repository.ts`,
      content: generateRepository(tableName),
    },
  ];

  if (hasServiceFile) {
    files.push({
      path: `src/server/${tableName}/service.ts`,
      content: generateService(tableName),
    });
    await generateWithAuthFile();
  }

  if (answers.generateApiRoutes) {
    const { mainRoute, idRoute } = generateRouteHandlers(
      tableName,
      hasServiceFile
    );
    files.push(
      {
        path: `src/app/api/${tableName}/route.ts`,
        content: mainRoute,
      },
      {
        path: `src/app/api/${tableName}/[id]/route.ts`,
        content: idRoute,
      }
    );
  }

  await generateBaseRepository();
  for (const file of files) {
    await fs.mkdir(path.dirname(file.path), { recursive: true });
    await fs.writeFile(file.path, file.content);
  }
}
