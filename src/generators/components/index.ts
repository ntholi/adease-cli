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
import { generateService } from './service';
import { Answers } from 'inquirer';
import { generateActions } from './actions';
import { generateWithAuthFile } from './withAuth';
import { generateRouteHandlers } from './route';

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
