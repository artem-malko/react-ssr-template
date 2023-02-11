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
    'boundaries/elements': [
      {
        type: 'framework',
        pattern: 'framework/!(public)/**/*',
        capture: ['category', 'family'],
      },
      {
        type: 'framework_with_public',
        pattern: 'framework/**/*',
        capture: ['category', 'family'],
      },
      {
        type: 'lib',
        pattern: 'lib/**/*',
        capture: ['category', 'elementName'],
      },

      {
        type: 'application/entry',
        pattern: 'application/entry/**/*',
        capture: ['category', 'family'],
      },
      {
        type: 'application/processes',
        pattern: 'application/processes/**/*',
        capture: ['category', 'family'],
      },
      {
        type: 'application/pages',
        pattern: 'application/pages/!(shared.ts)/**',
        capture: ['category', 'family'],
      },
      {
        type: 'application/pages_shared',
        pattern: 'application/pages/shared.ts',
        mode: 'file',
      },
      {
        type: 'application/widgets',
        pattern: 'application/widgets/**/*',
        capture: ['category', 'family'],
      },
      {
        type: 'application/features',
        pattern: 'application/features/**/*',
        capture: ['category', 'family'],
      },
      {
        type: 'application/entities',
        pattern: 'application/entities/**/*',
        capture: ['category', 'family'],
      },
      {
        type: 'application/shared',
        pattern: 'application/shared/**/*',
        capture: ['category', 'family'],
      },
    ],
    'boundaries/include': ['src/**/*'],
  },
  plugins: ['@typescript-eslint', 'functional', 'import', 'boundaries'],
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
    'boundaries/no-unknown-files': ['error'],
    'boundaries/element-types': [
      'error',
      {
        default: 'allow',
        message: '${file.type} is not allowed to import ${dependency.type}',
        rules: [
          // Global zones between main dirs lib|framework|application
          {
            from: ['framework'],
            disallow: [
              'application/entry',
              'application/pages',
              'application/widgets',
              'application/features',
              'application/entities',
              'application/shared',
            ],
            message:
              'Imports to the "framework" directory from the "application" directory are not allowed!',
          },
          {
            from: [
              'application/entry',
              'application/pages',
              'application/widgets',
              'application/features',
              'application/entities',
              'application/shared',
            ],
            disallow: ['framework'],
            message:
              'Imports from framework\'s internals are not allowed, use import from "framework/public" enstead!',
          },
          {
            from: ['lib'],
            disallow: [
              'framework',
              'application/entry',
              'application/pages',
              'application/widgets',
              'application/features',
              'application/entities',
              'application/shared',
            ],
            message: 'Imports to the "lib" directory from other directories are not allowed!',
          },
          // Locale zones for the application
          {
            message: 'Imports from "${target.type}" are not allowed in "application/processes".',
            from: ['application/processes'],
            disallow: ['application/entry'],
          },
          {
            message: 'Imports from "${target.type}" are not allowed in "application/pages".',
            from: ['application/pages'],
            disallow: ['application/processes', 'application/entry'],
          },
          {
            message:
              'Imports from "${target.type}" are not allowed in "application/widgets". Use imports from underlying layers like "application/features", "application/entites" or "application/shared" only.',
            from: ['application/widgets'],
            disallow: [
              'application/widgets',
              'application/pages',
              'application/processes',
              'application/entry',
            ],
          },
          {
            message:
              'Imports from "${target.type}" are not allowed in "application/features". Use imports from underlying layers like "application/entites" or "application/shared" only.',
            from: ['application/features'],
            disallow: [
              'application/features',
              'application/widgets',
              'application/pages',
              'application/processes',
              'application/entry',
            ],
          },
          {
            message:
              'Imports from "${target.type}" are not allowed in "application/entities". You can import from the underlying layer "application/shared" only.',
            from: ['application/entities'],
            disallow: [
              'application/entities',
              'application/features',
              'application/widgets',
              'application/pages',
              'application/processes',
              'application/entry',
            ],
          },
          {
            message:
              'Imports from "${target.type}" are not allowed in "application/shared". You can import from other "application/shared" dirs only.',
            from: ['application/shared'],
            disallow: [
              'application/entities',
              'application/features',
              'application/widgets',
              'application/pages',
              'application/processes',
              'application/entry',
            ],
          },
        ],
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
    'react/display-name': 'off',
    'react/no-unstable-nested-components': ['warn', { allowAsProps: true }],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: '(^usePopup$)',
      },
    ],
  },
};
