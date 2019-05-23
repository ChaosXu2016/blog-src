const nav = require('./nav.config')
const sidebar = require('./sidebar.config')
module.exports = {
  deploy: {
    remote: 'https://github.com/ChaosXu2016/blog.git'
  },
  base: '/blog/',
  title: 'xxx的博客',
  description: '这是说明这是说明～～～',
  dest: './dist/',
  themeConfig: {
    nav,
    sidebar
  }
}