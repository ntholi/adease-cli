import fs from 'fs';
import path from 'path';

export type DatabaseType = 'prisma' | 'drizzle' | 'firebase';
export type DrizzleEngine = 'sqlite' | 'postgresql';

export interface DatabaseConfig {
  type: DatabaseType;
  engine?: DrizzleEngine;
  url?: string;
  firebaseConfig?: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
}

interface Config {
  baseDir: string;
  adminDir: string;
  database: DatabaseConfig | null;
}

export function readConfig(): Config {
  const configPath = path.join(process.cwd(), 'adease.json');

  try {
    const configFile = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configFile);
  } catch (error) {
    throw new Error('adease.json not found, run `adease init` to create it');
  }
}

export function writeConfig(config: Config) {
  const configPath = path.join(process.cwd(), 'adease.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

export function baseDir(path: string): string {
  const config = readConfig();
  return `${config.baseDir}/${path.startsWith('/') ? path.slice(1) : path}`;
}
