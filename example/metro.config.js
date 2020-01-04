const extraModules = ['@babel/runtime', 'react', 'react-native'];

module.exports = {
  watchFolders: ['..'],
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    extraNodeModules: extraModules.reduce(
      (prev, current) => ({
        ...prev,
        [current]: `${__dirname}/node_modules/${current}`,
      }),
      {},
    ),
  },
};
