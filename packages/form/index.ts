import AdvForm from './src/formWrap.vue'
import useModel from './src/useModel'
import type { App, Plugin } from 'vue'
export type SFCWithInstall<T> = T & Plugin
;(AdvForm as SFCWithInstall<typeof AdvForm>).install = (app: App): void => {
  app.component(AdvForm.name, AdvForm)
}
export default AdvForm
export * from './src/formWrap'
export { useModel, AdvForm }
