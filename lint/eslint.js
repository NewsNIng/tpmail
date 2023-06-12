'use strict'

// src/eslint.ts
const config = {
  extends: ['@antfu', '@antfu/react', 'prettier'],
  rules: {
    '@typescript-eslint/no-this-alias': [
      'error',
      {
        allowDestructuring: false,
        allowedNames: ['self'],
      },
    ],
    'import/order': [
      'warn',
      {
        'groups': [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
        'newlines-between': 'always',
      },
    ],
    'curly': ['error', 'all'],
    'react/destructuring-assignment': [1, 'always'],
    'react/self-closing-comp': 1,
    'react/no-unknown-property': 1,
    'unicorn/custom-error-definition': 1,
    'unicorn/no-lonely-if': 1,
    'linebreak-style': ['error', 'unix'],
  },
}
module.exports = config
