import { capitalize, singular } from '../../utils/word';

export function generateActions(tableName: string, hasServiceFile: boolean) {
  const singularName = singular(tableName);
  const typeName = capitalize(singularName);
  const service = hasServiceFile
    ? `${singularName}Service`
    : `${singularName}Repository`;

  const serviceImport = hasServiceFile
    ? `import { ${singularName}Service } from '@/server/${tableName}/service';`
    : `import { ${singularName}Repository } from '@/server/${tableName}/repository';`;

  return `'use server'
${serviceImport}
import { ${tableName} } from '@/db/schema';

type ${typeName} = typeof ${tableName}.$inferInsert;

export async function get${typeName}(id: number) {
  return ${hasServiceFile ? `${service}.get(id)` : `${service}.findById(id)`};
}

export async function getAll${typeName}s(page: number = 1, search = '') {
  return ${service}.search(page, search, []);
}

export async function create${typeName}(${singularName}: ${typeName}) {
  return ${service}.create(${singularName});
}

export async function update${typeName}(id: number, ${singularName}: ${typeName}) {
  return ${service}.update(id, ${singularName});
}

export async function delete${typeName}(id: number) {
  return ${service}.delete(id);
}
`;
}
