/* eslint-env node */
/* eslint-disable no-undef */
module.exports = {
  contextSeparator: '_',
  createOldCatalogs: false,
  defaultNamespace: 'translation',
  defaultValue: '',
  indentation: 2,
  keepRemoved: false,
  keySeparator: false,
  lexers: {
    hbs: ['HandlebarsLexer'],
    handlebars: ['HandlebarsLexer'],
    htm: ['HTMLLexer'],
    html: ['HTMLLexer'],
    mjs: ['JavascriptLexer'],
    js: ['JavascriptLexer'],
    ts: ['JavascriptLexer'],
    jsx: ['JsxLexer'],
    tsx: ['JsxLexer'],
    default: ['JavascriptLexer']
  },
  lineEnding: 'auto',
  locales: ['en', 'mr'],
  namespaceSeparator: ':',
  output: 'src/i18n/$LOCALE.json',
  pluralSeparator: '_',
  input: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/i18n/**',
    '!**/node_modules/**'
  ],
  sort: true,
  skipDefaultValues: false,
  useKeysAsDefaultValue: true,
  verbose: false,
  failOnWarnings: false,
  customValueTemplate: null,
  resetDefaultValueLocale: null,
  i18nextOptions: null
};