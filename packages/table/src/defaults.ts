import type { PropType } from 'vue'
import tableProps from 'element-plus/lib/components/table/src/table/defaults.js'
import { paginationProps } from 'element-plus'

export type SoruceData = {
  data: any[]
  size: number
  total: number
  totalPage: number
}

export type FormatMaps = {
  [key: string]: keyof SoruceData
}

export type Source = (...args: any[]) => Promise<SoruceData>

export interface CustomHeader {
  label: string
  prop: string
  format?: (...args: any[]) => any
  [key: string]: any
}

export const advProps = {
  ...tableProps,
  ...paginationProps,
  hasPage: {
    type: Boolean,
    default: true,
  },
  autoRequest: {
    type: Boolean,
    default: true,
  },
  source: {
    type: Function as PropType<Source>,
  },
  isRecord: {
    type: Boolean,
    default: false,
  },
  isManual: {
    type: Boolean,
    default: false,
  },
  openSticky: {
    type: Boolean,
    default: true,
  },
  clientHeight: {
    type: Number,
    default: 450,
  },
  headers: {
    type: Array as PropType<CustomHeader[]>,
    default: () => [],
  },
  formatMaps: {
    type: Object as PropType<FormatMaps>,
  },
}
