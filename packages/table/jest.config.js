module.exports = {
  preset: 'ts-jest',
  setupFiles: ['./jest.setup.js'],
  globals: {
    '@vue/vue3-jest': {
      compilerOptions: {
        propsDestructureTransform: true,
      },
    },
  },
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\js$': 'babel-jest',
  },
  moduleFileExtensions: ['vue', 'js', 'json', 'jsx', 'ts', 'tsx', 'node'],
}
