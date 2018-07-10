module.exports = {
  transform: {
    '^.+\\.(j|t)sx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
