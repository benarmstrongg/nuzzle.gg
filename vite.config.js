import tsconfigPaths from 'vite-tsconfig-paths';

/** @type {import('vite').UserConfig} */
export default {
  base: './',
  publicDir: 'assets',
  plugins: [tsconfigPaths()],
};
