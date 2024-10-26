import path from 'path';
import fs from 'fs/promises';

export async function generateWithAuthFile() {
  const pathName = path.join(process.cwd(), 'src/lib/auth/withAuth.ts');
  await fs.mkdir(path.dirname(pathName), { recursive: true });
  await fs.writeFile(pathName, getContent());

  await generateAuthType();
}

async function generateAuthType() {
  const pathName = path.join(process.cwd(), 'src/lib/auth/auth.d.ts');
  await fs.mkdir(path.dirname(pathName), { recursive: true });
  await fs.writeFile(
    pathName,
    `import 'next-auth';
import { users } from '@/db/schema';

type UserRole = (typeof users.$inferSelect)['role'];

declare module 'next-auth' {
  interface User {
    role: UserRole;
  }

  interface Session {
    user: User & {
      role: UserRole;
    };
  }
}
`
  );
}

function getContent(): string {
  return `'use server';

import { auth } from '@/auth';
import { users } from '@/db/schema';

type Role = (typeof users.$inferSelect)['role'];

export default async function withAuth(fn: Function, roles: Role[] = []) {
  const session = await auth();
  if (!session || !roles.includes(session.user.role)) {
    throw new Error('Unauthorized');
  }
  return await fn();
}`;
}
