export default {
  base: '/advanced-elements-next/',
  title: 'AdvancedElements',
  description: 'element-plus,advanced,中后台',
  themeConfig: {
    lastUpdated: 'lastUpdate',
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/docs/getting-started' },
      { text: '组件', link: '/components/' },
      { text: 'Github', link: 'https:github.com/ChuHingYee/advanced-elements-next' },
    ],
    sidebar: {
      '/docs/': [
        {
          title: '文档',
          collapsable: false,
          items: [{
            text: '快速开始',
            link: '/docs/getting-started'
          }],
        },
      ],
      '/components/': [
        {
          title: '架构设计',
          collapsable: false,
          items: [{
            text: '组件总览',
            link: '/components/'
          }],
        },
        {
          title: '数据展示',
          collapsable: false,
          items: [{
            text: '表格',
            link: '/components/table'
          }],
        },
        {
          title: '表单',
          collapsable: false,
          items: [{
            text: '表单',
            link: '/components/form'
          }],
        },
      ],
    },
  },
  markdown: {
    anchor: { permalink: false },
    toc: { includeLevel: [1, 2] },
  }
}