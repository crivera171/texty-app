module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  "ignore": ['./node_modules/aws-sdk/*'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./App'],
        alias: {
          test: './test',
          '@': './App',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
