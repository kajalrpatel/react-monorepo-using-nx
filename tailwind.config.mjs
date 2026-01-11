import { createGlobPatternsForDependencies } from '@nx/react/tailwind';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    join(__dirname, 'file-explorer/src/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    join(
      __dirname,
      'country-capital-game/src/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
