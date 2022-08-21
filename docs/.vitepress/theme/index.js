import theme from 'vitepress/dist/client/theme-default'
import 'vitepress-theme-demoblock/theme/styles/index.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '../styles/reset.css'
import Demo from 'vitepress-theme-demoblock/components/Demo.vue'
import DemoBlock from 'vitepress-theme-demoblock/components/DemoBlock.vue'
import { AdvTable } from '../../../packages/table/es'
import '../../../packages/table/es/index.css'
import { AdvForm } from '../../../packages/form/es'
import '../../../packages/form/es/index.css'
export default {
  ...theme,
  enhanceApp({ app, router, siteData }) {
    app.use(ElementPlus)
    app.component('Demo', Demo)
    app.component('DemoBlock', DemoBlock)
    app.component('AdvTable', AdvTable)
    app.component('AdvForm', AdvForm)
  }
}