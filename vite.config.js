import { resolve } from 'path';
import { defineConfig } from 'vite';
import { builtinModules } from 'module';
import { copyFileSync, mkdirSync } from 'fs';
import { glob } from 'glob';
import path from 'path';

function copyEjsPlugin() {
  console.log('Copying .ejs files...');
  return {
    name: 'copy-ejs-templates',
    closeBundle: () => {
      const templates = glob.sync('src/**/*.ejs');
      templates.forEach((file) => {
        const relativePath = path.relative('src', file);
        const targetPath = path.join('dist', relativePath);
        mkdirSync(path.dirname(targetPath), { recursive: true });
        copyFileSync(file, targetPath);
      });
    },
  };
}

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
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
