const path = require('path');

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          'react-navigation-collapsible': path.resolve(__dirname, '..'),
        },
      },
    ],
  ],
};
