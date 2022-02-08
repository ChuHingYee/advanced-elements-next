// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defineConfig } = require('eslint-define-config')
module.exports = defineConfig({
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      tsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    'jest/globals': true,
    'vue/setup-compiler-macros': true,
  },
  plugins: ['@typescript-eslint', 'jest', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'prettier',
  ],
  settings: {
    jest: {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      version: require('jest/package.json').version,
    },
  },
  rules: {
    // js/ts
    'no-console': ['warn', { allow: ['error'] }],
    'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],
    camelcase: ['error', { properties: 'never' }],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'no-var': 'error',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'no-void': 'error',
    'prefer-const': [
      'warn',
      { destructuring: 'all', ignoreReadBeforeAssign: true },
    ],
    'prefer-template': 'error',
    'object-shorthand': [
      'error',
      'always',
      { ignoreConstructors: false, avoidQuotes: true },
    ],
    'block-scoped-var': 'error',
    'no-constant-condition': ['error', { checkLoops: false }],

    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { disallowTypeAnnotations: false },
    ],

    // vue
    'vue/no-v-html': 'off',
    'vue/require-default-prop': 'off',
    'vue/require-explicit-emits': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/script-setup-uses-vars': 'error',

    // prettier
    'prettier/prettier': 'error',
  },
})
