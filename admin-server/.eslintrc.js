const fs = require('fs');

const prettierOptions = JSON.parse(fs.readFileSync('./.prettierrc', 'utf8'));

module.exports = {
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 9,
    sourceType: 'module',
  },
  env: {
    node: true,
    mocha: true,
  },
  rules: {
    'prettier/prettier': ['error', prettierOptions],
    'arrow-body-style': [2, 'as-needed'],
    'no-use-before-define': ['error', { variables: false }],
    'consistent-return': 0,
    'no-underscore-dangle': 0,
    'no-console': [
      'error',
      {
        allow: ['warn', 'error', 'info'],
      },
    ],
  },
};
