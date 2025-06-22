import eslint from '@eslint/js';
import react from 'eslint-plugin-react';
import ts from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser,
    },
    plugins: {
      react,
      '@typescript-eslint': ts,
    },
    rules: {
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  }
];
