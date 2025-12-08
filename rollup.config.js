import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/weles-sdk.ts',
  output: [
    {
      file: 'dist/weles-sdk.esm.js',
      format: 'es'
    },
    {
      file: 'dist/weles-sdk.umd.js',
      format: 'umd',
      name: 'weles-ai',
    }
  ],   
  external: ['undici'],
  plugins: [typescript(), nodeResolve()],
  // plugins: [typescript()],
};
