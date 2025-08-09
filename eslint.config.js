import js from '@eslint/js';
import { configs as tsConfigs, parser as tsParser } from 'typescript-eslint';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Puente para usar "extends" clásicos dentro de flat config
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  // Ignorados
  { ignores: ['node_modules/**', 'dist/**', 'env.d.ts', 'commitlint.config.js'] },

  // Recomendados base JS + TS
  js.configs.recommended,
  ...tsConfigs.recommended,

  // Tus "extends" originales traídos vía compat
  ...compat.extends(
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/typescript',
    'prettier',
  ),

  // Ajustes y reglas personalizadas
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
      },
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        node: {
          paths: ['src'],
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        typescript: { alwaysTryTypes: true },
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
    },
    rules: {
      'no-unused-vars': [
        'error',
        { vars: 'all', args: 'after-used', ignoreRestSiblings: true, argsIgnorePattern: '^_' },
      ],
      'import/no-named-as-default': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },

  // Override para tu worker
  {
    files: ['public/worker.js'],
    languageOptions: { globals: { self: 'readonly' } },
    rules: { 'no-undef': 'off' },
  },
];
