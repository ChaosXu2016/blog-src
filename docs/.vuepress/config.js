const config = require('../../config')
const path = require('path')

module.exports = {
  ...config,
  configureWebpack: {
    resolve: {
      alias: {
        '@imgs': path.resolve(__dirname, './public/imgs')
      }
    }
  },
}