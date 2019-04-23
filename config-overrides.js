// Overriding CreateReactApp settings, ref: https://github.com/arackaf/customize-cra
const antdTheme = require('./src/theme.js')
const {
  override,
  fixBabelImports,
  addLessLoader,
  useEslintRc,
  addDecoratorsLegacy,
} = require('customize-cra')

module.exports = override(
  addDecoratorsLegacy(),
  useEslintRc(),
  fixBabelImports('import', {
    libraryName: 'antd', libraryDirectory: 'es', style: true
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: antdTheme
  })
);

module.exports = Object.assign(module.exports, {
  devServer: configFunction => (proxy, allowedHost) => {
    proxy[0].context = '/api';
    console.log(proxy);
    const config = configFunction(proxy, allowedHost);
    console.log(config);
    return config;
  }
});