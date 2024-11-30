import { resolve } from 'path';
import { defineConfig } from 'vite';
import { builtinModules } from 'module';
import { copyFileSync, mkdirSync } from 'fs';
import { glob } from 'glob';
import path from 'path';

function copyEjsPlugin() {
  console.log('Copying .ejs files...');
  const dirs = ['Create', 'Init'];
  return {
    name: 'copy-ejs-templates',
    closeBundle: () => {
      dirs.map((it) => {
        const templates = glob.sync(`src/commands/${it}/generators/**/*.ejs`);
        templates.forEach((file) => {
          const relativePath = path.relative(
            `src/commands/${it}/generators/`,
            file
          );
          const targetPath = path.join(`dist/${it}`, relativePath);
          mkdirSync(path.dirname(targetPath), { recursive: true });
          copyFileSync(file, targetPath);
        });
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
