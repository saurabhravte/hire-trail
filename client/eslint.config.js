import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'src/routeTree.gen.ts']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['src/routes/**/*.{ts,tsx}', 'src/components/ui/**/*.{ts,tsx}', 'src/components/providers/**/*.{ts,tsx}', 'src/main.tsx', 'src/features/landing/components/preview-mockups.tsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
  {
    // React Compiler-era rules from eslint-plugin-react-hooks 7: report, don't block.
    files: ['**/*.{ts,tsx}'],
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/incompatible-library': 'warn',
    },
  },
])
