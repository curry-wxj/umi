import path from 'path';

const eslintFormatter = require('react-dev-utils/eslintFormatter');

export default config => {
  config.module
  .rule('lint')
  .test(/.(js|jsx|mjs)$/)
  .pre()
  .include
  .add(path.resolve('src'))
  .end()
  .use('eslint')
  .loader('eslint-loader')
  .options({
    formatter: eslintFormatter,
  });
};
