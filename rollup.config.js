import esbuild from 'rollup-plugin-esbuild';
import shebang from 'rollup-plugin-preserve-shebang';

export default [
  {
    external: (id) => !/^[./]/.test(id),
    input: 'src/index.ts',
    plugins: [esbuild(), shebang()],
    output: [
      {
        file: `dist/index.js`,
        format: 'cjs',
      },
    ],
  },
  {
    external: (id) => !/^[./]/.test(id),
    input: 'src/cli.ts',
    plugins: [esbuild(), shebang()],
    output: [
      {
        file: `dist/cli.js`,
        format: 'cjs',
      },
    ],
  },
];
