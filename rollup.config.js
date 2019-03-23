const babel = require('rollup-plugin-babel');
const pkg = require('./package.json');

module.exports = {
  input: 'src/index.js',
  output: {
    file: `cjs/${pkg.name}.js`,
    format: 'cjs'
  },
  external: ['react'],
  plugins: [
    babel({ exclude: /node_modules/ })
  ]
};
