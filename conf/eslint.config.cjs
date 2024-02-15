/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
    project: './conf/tsconfig.eslint.json',
  },
  ignorePatterns: [
    'dist',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/strict',
    'plugin:@typescript-eslint/stylistic',
    'plugin:unicorn/recommended',
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  settings: {
    'import/resolver': {
      typescript: {
        extensions: [
          '.js',
          '.cjs',
          '.mjs',
          '.ts',
          '.d.ts',
        ],
      },
    },
  },
  rules: {
    '@typescript-eslint/class-methods-use-this': 'error',
    '@typescript-eslint/consistent-type-exports': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/default-param-last': 'error',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-import-type-side-effects': 'error',
    '@typescript-eslint/member-delimiter-style': 'error',
    '@typescript-eslint/method-signature-style': 'error',
    'no-extra-parens': 'off',
    '@typescript-eslint/no-extra-parens': 'error',
    'no-invalid-this': 'off',
    '@typescript-eslint/no-invalid-this': 'error',
    '@typescript-eslint/no-loop-func': 'error',
    'no-magic-numbers': 'off',
    '@typescript-eslint/no-magic-numbers': [
      'error',
      {
        ignore: [
          -1,
          0,
          1,
          255,
        ],
      },
    ],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/promise-function-async': 'error',
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    'import/no-default-export': 'error',
    'import/prefer-default-export': 'off',
    'unicorn/consistent-destructuring': 'error',
    'unicorn/custom-error-definition': 'error',
    'unicorn/no-nested-ternay': 'off',
    'no-nested-ternary': 'error',
    'unicorn/no-unused-properties': 'error',
    'no-continue': 'off',
    'array-callback-return': [
      'error',
      {
        allowImplicit: true,
      },
    ],
    'unicorn/prefer-switch': 'off',
    'unicorn/string-content': [
      'error',
      {
        patterns: {
          '^http:\\/\\/': '^https:\\/\\/',
        },
      },
    ],
    '@typescript-eslint/consistent-type-assertions': [
      'error',
      {
        assertionStyle: 'angle-bracket',
      },
    ],
    'import/extensions': [
      'error',
      'always',
      {
        '': 'never',
        js: 'never',
        ts: 'never',
      },
    ],
    'max-len': [
      'error',
      {
        code: 120,
        ignoreUrls: true,
      },
    ],
    'no-param-reassign': [
      'error',
      {
        props: false,
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          './conf/*',
          './tests/**/*.test.ts',
        ],
      },
    ],
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'always',
        warnOnUnassignedImports: true,
        groups: [
          'builtin',
          'external',
          'unknown',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
      },
    ],
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        // eslint-disable-next-line max-len
        message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'LabeledStatement',
        message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],
  },
  overrides: [{
    files: [
      './src/errors/*.ts',
    ],
    rules: {
      'unicorn/filename-case': [
        'error',
        {
          case: 'pascalCase',
        },
      ],
    },
  }],
};
