await Promise.all([
  // ESM build
  Bun.build({
    entrypoints: ['./src/index.ts'],
    outdir: './dist',
    format: 'esm',
    target: 'node',
    sourcemap: 'external',
    naming: 'index.js',
  }),
  // CJS build
  Bun.build({
    entrypoints: ['./src/index.ts'],
    outdir: './dist',
    format: 'cjs',
    target: 'node',
    sourcemap: 'external',
    naming: 'index.cjs',
  }),
]);

console.log('Build complete!');
