import type { PropType } from 'vue'
import tableProps from 'element-plus/lib/components/table/src/table/defaults'
import { paginationProps } from 'element-plus'

export type SoruceData = {
  data: any[]
  total: number
}

export type FormatMaps = {
  [key: string]: keyof SoruceData
}

export type Source = (...args: any[]) => Promise<any>

export interface CustomHeader {
  label: string
  prop: string
  isVisible?: boolean
  format?: (...args: any[]) => any
  [key: string]: any
}

export interface LocalHeader extends Omit<CustomHeader, 'isVisible'> {
  isVisible: boolean
}

export const advProps = {
  ...tableProps,
  ...paginationProps,
  hasColumnSetting: {
    type: Boolean,
    default: true,
  },
  hasRefreshBtn: {
    type: Boolean,
    default: false,
  },
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
    default: () => {
      return {
        data: 'data',
        total: 'total',
      }
    },
  },
}
