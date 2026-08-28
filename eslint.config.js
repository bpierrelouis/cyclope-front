import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import sortKeysFix from 'eslint-plugin-sort-keys-fix';
import globals from 'globals';

export default defineConfig([
    globalIgnores(['dist', 'coverage']),
    {
        extends: [
            js.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
        ],
        files: ['**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                ecmaFeatures: { jsx: true },
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        plugins: {
            'simple-import-sort': simpleImportSort,
            'sort-keys-fix': sortKeysFix,
        },
        rules: {
            'array-callback-return': 'error',
            'comma-dangle': ['error', 'always-multiline'],
            'comma-spacing': ['error', { after: true, before: false }],
            'curly': ['error', 'multi-line', 'consistent'],
            'default-case-last': 'error',
            'dot-notation': 'error',
            'eqeqeq': ['error', 'always', { null: 'ignore' }],
            'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
            'indent': ['error', 4, { SwitchCase: 1 }],
            'jsx-quotes': ['error', 'prefer-single'],
            'no-alert': 'error',
            'no-console': ['error', { allow: ['warn', 'error'] }],
            'no-else-return': ['error', { allowElseIf: false }],
            'no-eval': 'error',
            'no-extend-native': 'error',
            'no-extra-bind': 'error',
            'no-implicit-globals': 'error',
            'no-implied-eval': 'error',
            'no-labels': 'error',
            'no-lone-blocks': 'error',
            'no-lonely-if': 'error',
            'no-new-func': 'error',
            'no-new-wrappers': 'error',
            'no-object-constructor': 'error',
            'no-proto': 'error',
            'no-return-await': 'error',
            'no-sequences': 'error',
            'no-shadow': ['error', { hoist: 'all' }],
            'no-template-curly-in-string': 'error',
            'no-trailing-spaces': 'error',
            'no-unexpected-multiline': 'error',
            'no-unused-vars': ['error', {
                argsIgnorePattern: '^_',
                caughtErrors: 'all',
                caughtErrorsIgnorePattern: '^_',
                varsIgnorePattern: '^[A-Z_]',
            }],
            'no-useless-call': 'error',
            'no-useless-concat': 'error',
            'no-useless-return': 'error',
            'no-var': 'error',
            'object-curly-newline': ['error', {
                ObjectExpression: {
                    consistent: true,
                    minProperties: 4,
                    multiline: true,
                },
                ObjectPattern: {
                    consistent: true,
                    minProperties: 4,
                    multiline: true,
                },
            }],
            'object-curly-spacing': ['error', 'always'],
            'object-shorthand': ['error', 'always'],
            'prefer-const': ['error', { destructuring: 'all' }],
            'prefer-object-spread': 'error',
            'prefer-template': 'error',
            'quotes': ['error', 'single', { avoidEscape: true }],
            'radix': 'error',
            'semi': ['error', 'always'],
            'simple-import-sort/exports': 'error',
            'simple-import-sort/imports': 'error',
            'sort-keys-fix/sort-keys-fix': ['error', 'asc', {
                caseSensitive: false,
                natural: true,
            }],
            'yoda': 'error',
        },
    },
    {
        files: ['src/**/*.{js,jsx}'],
        rules: {
            'no-restricted-imports': ['error', {
                patterns: [
                    {
                        message: 'Do not include .js or .jsx extensions in import paths.',
                        regex: String.raw`\.jsx?$`,
                    },
                    {
                        message: 'Import the folder directly instead of its index file.',
                        regex: String.raw`/index(?:\.jsx?)?$`,
                    },
                ],
            }],
        },
    },
]);
