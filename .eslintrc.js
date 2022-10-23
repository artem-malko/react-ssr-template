module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/typescript',
  ],
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
  plugins: ['@typescript-eslint', 'functional', 'import'],
  overrides: [
    {
      files: ['*.spec.tsx', '*.spec.ts'],
      rules: {
        'no-unused-expressions': 'off',
        'functional/immutable-data': 'off',
      },
    },
  ],
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'react/display-name': 'off',
    'react/no-unstable-nested-components': ['warn', { allowAsProps: true }],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          {
            target: './src/framework',
            from: './src/application',
            message: 'Imports to the framework directory from an application directory are not allowed!',
          },
        ],
      },
    ],
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: '(^usePopup$)',
      },
    ],
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'object', 'type'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc' },
      },
    ],
    'functional/immutable-data': [
      'error',
      {
        assumeTypes: true,
        ignoreImmediateMutation: true,
        ignorePattern: ['ef.current', '^mutable', '^_mutable', '^classNames'],
        ignoreAccessorPattern: [
          '*.displayName',
          '**.mutable*.**',
          '**._mutable*.**',
          'div.**',
          'this.**',
          'window.**',
          '*.document.**',
          '*ef.current',
        ],
      },
    ],
  },
};
