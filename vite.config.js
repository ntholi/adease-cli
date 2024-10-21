import { resolve } from 'path';
import { defineConfig } from 'vite';
import { builtinModules } from 'module';

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
  resolve: {
    alias: {
      // Add any necessary aliases here
    },
  },
});
