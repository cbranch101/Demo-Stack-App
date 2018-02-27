process.env.NODE_ENV = 'development'
require('babel-register')({
    babelrc: false,
    presets: [require.resolve('babel-preset-react-app')],
    plugins: ['transform-es2015-modules-commonjs'],
});

require('../src/save-schema.js')
