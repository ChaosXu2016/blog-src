module.exports = {
  base: '/blog/',
  title: 'xxx的博客',
  description: '这是说明这是说明～～～',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '技术', link: '/technique/' },
      { text: '随笔', link: '/diary/' },
    ],
    sidebar: {
      '/diary/': [
        '2019-05-23'
      ],
      '/technique/': [
        'taro-and-weapp'
      ]
    }
  }
}