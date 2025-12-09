import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const libraryConfig = {
  input: 'src/weles-sdk.ts',
  output: [
    {
      file: 'dist/weles-sdk.esm.js',
      format: 'es',
    },
    {
      file: 'dist/weles-sdk.umd.js',
      format: 'umd',
      name: 'weles-ai',
    }
  ],
  external: ['undici'],
  plugins: [typescript(), nodeResolve()],
};

const cliConfig = {
  input: 'src/cli.ts',
  output: [
    {
      file: 'dist/weles-ai-cli.js',
      format: 'cjs',
      banner: '#!/usr/bin/env node'      
    }
  ],
  external: ['undici', 'dotenv', 'node:fs', 'node:path', 'fs', 'path'],
  plugins: [typescript(), nodeResolve({ preferBuiltins: true })],
};

export default [libraryConfig, cliConfig];
