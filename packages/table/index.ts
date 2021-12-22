import AdvTable from './src/table.vue'
import type { App, Plugin } from 'vue'
export type SFCWithInstall<T> = T & Plugin
;(AdvTable as SFCWithInstall<typeof AdvTable>).install = (app: App): void => {
  app.component(AdvTable.name, AdvTable)
}
export default AdvTable
export * from './src/defaults'
export { AdvTable }
