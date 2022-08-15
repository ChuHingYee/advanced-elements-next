import type { IUseCheckboxProps } from 'element-plus/es/components/checkbox/src/useCheckbox'
import type { ComponentSize } from 'element-plus'
export type CheckboxOptionProps = IUseCheckboxProps & {
  size?: ComponentSize
}
type Fn = (...args: any[]) => Promise<CheckboxOptionProps[]>
export type CheckboxComponentOption = {
  [key: string]: any
  options?: CheckboxOptionProps[]
  request?: Fn
}

export type ModelValue = string | number | boolean
