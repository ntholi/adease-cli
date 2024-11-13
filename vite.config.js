import { resolve } from 'path';
import { defineConfig } from 'vite';
import { builtinModules } from 'module';
import { copyFileSync, mkdirSync } from 'fs';
import { glob } from 'glob';
import path from 'path';

function copyEjsPlugin() {
  return {
    name: 'copy-ejs-templates',
    closeBundle: () => {
      const templates = glob.sync('src/generators/**/*.ejs');
      templates.forEach((file) => {
        const relativePath = path.relative('src/generators', file);
        const targetPath = path.join('dist', relativePath);
        mkdirSync(path.dirname(targetPath), { recursive: true });
        copyFileSync(file, targetPath);
      });
    },
  };
}

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'AdeaseCli',
      fileName: 'main',
      formats: ['es'],
    },
    rollupOptions: {
      external: [...builtinModules, 'chalk', 'commander', 'inquirer', /^node:/],
      output: {
        format: 'es',
      },
    },
    target: 'esnext',
  },
  plugins: [copyEjsPlugin()],
});
