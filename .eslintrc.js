const privateImportErrorMessage =
  'Private imports are prohibited, use public imports instead from an index file';
const preferAbsolutePath = 'Prefer absolute imports instead of relatives';

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
        pattern: 'src/framework/!(public)/**/*',
      },
      {
        type: 'framework_with_public',
        pattern: 'src/framework/**/*',
      },
      {
        type: 'lib',
        pattern: 'src/lib/**/*',
        capture: ['category', 'elementName'],
      },
      {
        type: 'application/entry',
        pattern: 'application/entry/**/*',
      },
      {
        type: 'application/processes',
        pattern: 'application/processes/**/*',
      },
      {
        type: 'application/pages',
        pattern: 'application/pages/!(shared.ts)/**',
      },
      {
        type: 'application/pages_shared',
        pattern: 'application/pages/shared.ts',
        mode: 'file',
      },
      {
        type: 'application/widgets',
        pattern: 'application/widgets/**/*',
      },
      {
        type: 'application/features',
        pattern: 'application/features/**/*',
      },
      {
        type: 'application/entities/ui',
        pattern: 'application/entities/ui/**/*',
      },
      {
        type: 'application/entities/domain',
        pattern: 'application/entities/domain/**/*',
      },
      {
        type: 'application/shared',
        pattern: 'application/shared/**/*',
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
    /**
     * Sometimes @ts-ignore can be usefull
     */
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'boundaries/no-unknown-files': ['error'],
    /**
     * This rule creates restrictions for imports between layers
     */
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
              'application/entities/domain',
              'application/entities/ui',
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
              'application/entities/domain',
              'application/entities/ui',
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
              'application/entities/domain',
              'application/entities/ui',
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
              'Imports from "${target.type}" are not allowed in "application/entities/domain". You can import from the underlying layer "application/shared" only.',
            from: ['application/entities/domain'],
            disallow: [
              'application/entities/domain',
              'application/entities/ui',
              'application/features',
              'application/widgets',
              'application/pages',
              'application/processes',
              'application/entry',
            ],
          },
          {
            message:
              'Imports from "${target.type}" are not allowed in "application/entities/ui". You can import from the underlying layer "application/shared" or "application/entities/domain" only.',
            from: ['application/entities/ui'],
            disallow: [
              'application/entities/ui',
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
              'application/entities/domain',
              'application/entities/ui',
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
      'error',
      {
        alphabetize: { order: 'asc', caseInsensitive: true },
        'newlines-between': 'always',
        pathGroups: [
          { group: 'external', position: 'after', pattern: 'framework/**/*' },
          { group: 'external', position: 'after', pattern: 'lib/**/*' },
          { group: 'internal', position: 'after', pattern: 'application/processes/**' },
          { group: 'internal', position: 'after', pattern: 'application/pages/**' },
          { group: 'internal', position: 'after', pattern: 'application/widgets/**' },
          { group: 'internal', position: 'after', pattern: 'application/features/**' },
          { group: 'internal', position: 'after', pattern: 'application/entities/**' },
          { group: 'internal', position: 'after', pattern: 'application/shared/**' },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'object', 'type'],
      },
    ],
    'no-duplicate-imports': ['error', { includeExports: true }],
    /**
     * This is an addition to boundaries
     *
     * Allows to create rules to:
     * * import from an index file only between main dirs
     * * prefer absolute path, between main dirs
     */
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            message: privateImportErrorMessage,
            group: ['application/entry/**'],
          },
          {
            message: privateImportErrorMessage,
            group: ['application/processes/*/**'],
          },
          {
            message: privateImportErrorMessage,
            group: ['application/pages/*/**'],
          },
          {
            message: privateImportErrorMessage,
            group: ['application/widgets/*/**'],
          },
          {
            message: privateImportErrorMessage,
            group: ['application/features/*/**'],
          },
          {
            message: privateImportErrorMessage,
            group: ['application/entities/domain/*/**'],
          },
          {
            message: privateImportErrorMessage,
            group: ['application/entities/ui/*/**'],
          },
          {
            message: privateImportErrorMessage,
            group: ['application/shared/*/*/**'],
          },
          {
            message: preferAbsolutePath,
            group: ['../**/entry'],
          },
          {
            message: preferAbsolutePath,
            group: ['../**/processes'],
          },
          {
            message: preferAbsolutePath,
            group: ['../**/pages'],
          },
          {
            message: preferAbsolutePath,
            group: ['../**/widgets'],
          },
          {
            message: preferAbsolutePath,
            group: ['../**/features'],
          },
          {
            message: preferAbsolutePath,
            group: ['../**/entities/domain'],
          },
          {
            message: preferAbsolutePath,
            group: ['../**/entities/ui'],
          },
          {
            message: preferAbsolutePath,
            group: ['../**/shared'],
          },
        ],
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
    /**
     * Disallow creating unstable components inside components
     *
     * @example
     * const Component = () => {
     *  const UnstableNestedComponent = () => {
     *    return <div />;
     *  }
     *
     *  return (
     *    <div>
     *      <UnstableNestedComponent />
     *    </div>
     *  );
     * }
     */
    'react/no-unstable-nested-components': ['warn', { allowAsProps: true }],
    /**
     * Prop-types in 2k23? Really?)
     */
    'react/prop-types': 'off',
    /**
     * No needed rule, cause we have React in a scope automatically
     */
    'react/react-in-jsx-scope': 'off',
    'react-hooks/exhaustive-deps': [
      'error',
      {
        additionalHooks: '(^usePopup$)',
      },
    ],
  },
};
