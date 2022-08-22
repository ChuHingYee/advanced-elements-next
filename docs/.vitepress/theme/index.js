import DefaultTheme from 'vitepress/theme'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '../styles/reset.scss'
import { AdvTable } from '../../../packages/table/es'
import '../../../packages/table/es/index.css'
import { AdvForm } from '../../../packages/form/es'
import '../../../packages/form/es/index.css'
export default {
  ...DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    app.use(ElementPlus)
    app.use(AdvTable)
    app.use(AdvForm)
  },
}