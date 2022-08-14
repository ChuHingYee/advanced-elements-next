import tableProps from 'element-plus/lib/components/table/src/table/defaults'
import { paginationProps } from 'element-plus'
import type { PropType } from 'vue'

export type SoruceData = {
  data: any[]
  total: number
}

export type FormatMaps = Record<string, keyof SoruceData>

export type Fn = (...args: any[]) => void

export type Source = (...args: any[]) => Promise<any>

export interface PollingOptions {
  time: number
  immediate: boolean
  startTip?: string
  stopTip?: string
  onChange?: Fn
  onSuccess?: Fn
  onFail?: Fn
}

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

export interface AdvTableContext {
  refresh: () => Promise<void>
  localLoading: boolean
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
  hasPollingBtn: {
    type: Boolean,
    default: false,
  },
  pollingOptions: {
    type: Object as PropType<PollingOptions>,
    default: () => {
      return {
        time: 3000,
        immediate: false,
      }
    },
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
