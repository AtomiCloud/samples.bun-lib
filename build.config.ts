const results = await Promise.all([
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

// Check for build failures
let hasErrors = false;
for (const result of results) {
  if (!result.success) {
    console.error('Build failed!');
    hasErrors = true;
  }
  if (result.logs.length > 0) {
    for (const log of result.logs) {
      console.error(log.message);
    }
  }
}

if (hasErrors) {
  process.exit(1);
}

console.log('Build complete!');
