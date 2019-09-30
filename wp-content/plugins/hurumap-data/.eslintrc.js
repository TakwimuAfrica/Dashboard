module.exports = {
    root: true,
    extends: ['airbnb', 'plugin:prettier/recommended', 'prettier/react'],
    env: {
      browser: true,
      jest: true
    },
    plugins: ['react-hooks', 'json'],
    rules: {
      'no-unused-vars': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-filename-extension': [1, { extensions: ['.js'] }],
      'react/prop-types': [2, { ignore: ['classes'] }],
      'react/jsx-props-no-spreading': 0
    }
  };