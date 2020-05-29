module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'standard',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
  ],
  rules: {
    'no-undef': 0,
    'no-unused-vars': 0,
    'no-unused-expressions': 0,
    'comma-dangle': ['warn', 'always-multiline'],
  }
}
