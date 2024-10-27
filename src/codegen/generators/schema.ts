import fs from 'fs/promises';
import path from 'path';
import { Property } from '../../types';

export async function generateSchema(
  tableName: string,
  properties: Property[]
) {
  const schemaPath = path.join(process.cwd(), 'src/db', 'schema.ts');

  try {
    await fs.access(schemaPath);
    console.log('Schema file already exists. Appending new table...');
    await appendToSchema(schemaPath, tableName, properties);
  } catch (error) {
    console.log('Schema file does not exist. Creating new schema...');
    await createNewSchema(schemaPath, tableName, properties);
  }
}

async function createNewSchema(
  schemaPath: string,
  tableName: string,
  properties: Property[]
) {
  const schemaContent = generateSchemaContent(tableName, properties);

  await fs.mkdir(path.dirname(schemaPath), { recursive: true });
  await fs.writeFile(schemaPath, schemaContent);

  console.log(`Schema file created at ${schemaPath}`);
}

async function appendToSchema(
  schemaPath: string,
  tableName: string,
  properties: Property[]
) {
  const existingContent = await fs.readFile(schemaPath, 'utf-8');

  if (existingContent.includes(`export const ${tableName} = pgTable`)) {
    console.log(`Table "${tableName}" already exists in schema. Skipping...`);
    return;
  }

  const newTableSchema = generateTableSchema(tableName, properties);
  const updatedContent = existingContent + '\n\n' + newTableSchema;

  await fs.writeFile(schemaPath, updatedContent);
  console.log(`New table appended to schema at ${schemaPath}`);
}

function generateSchemaContent(tableName: string, properties: Property[]) {
  return `import { pgTable, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

${generateTableSchema(tableName, properties)}`;
}

function generateTableSchema(tableName: string, properties: Property[]) {
  const columns = properties
    .map((prop) => {
      switch (prop.type.toLowerCase()) {
        case 'string':
          return `  ${prop.name}: text(),`;
        case 'number':
          return `  ${prop.name}: integer(),`;
        case 'boolean':
          return `  ${prop.name}: boolean(),`;
        case 'date':
          return `  ${prop.name}: timestamp(),`;
        default:
          return `  ${prop.name}: text(),`;
      }
    })
    .join('\n');

  return `export const ${tableName} = pgTable('${tableName}', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
${columns}
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp(),
});`;
}
