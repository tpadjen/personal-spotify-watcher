module.exports = {
  root: true,
  env: {
    'browser': true,
    'es6': true,
    'jest': true,
    'node': true,
  },
  parser: 'babel-eslint',
  extends: [
    'plugin:react/recommended'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  plugins: ['babel', 'react'],
  rules: {
    indent: [
      'error',
      2,
      {
        'SwitchCase': 1
      }
    ],
    quotes: ['error', 'single',
      {
        'avoidEscape': true
      }
    ],
    semi: ['error', 'never'],
    eqeqeq: 'error',
    'react/prop-types': 0,
    'no-unused-vars': ['warn',
      {
        'args': 'all', 'argsIgnorePattern': '^_'
      }
    ],
    'no-undef': 'warn',
  }
}
