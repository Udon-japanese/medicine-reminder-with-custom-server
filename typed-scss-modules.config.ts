/* eslint-disable import/no-anonymous-default-export */
export default {
  exportType: 'default',
  aliasPrefixes: {
    '@': 'src/',
    '@styles/': 'src/styles/',
  },
  additionalData: '@use \'@styles/variables\' as *;',
  ignore: ['**/_*.scss'],
  nameFormat: 'camel',
  implementation: 'sass',
};
