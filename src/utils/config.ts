import fs from 'fs';
import path from 'path';

interface Config {
  baseDir: string;
  adminDir: string;
}

export function readConfig(): Config {
  const configPath = path.join(process.cwd(), 'adease.json');

  try {
    const configFile = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configFile);
  } catch (error) {
    return {
      baseDir: 'src',
      adminDir: 'admin',
    };
  }
}

export function baseDir(path: string): string {
  const config = readConfig();
  return `${config.baseDir}/${path.startsWith('/') ? path.slice(1) : path}`;
}
