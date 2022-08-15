export interface Option {
  value: string | number | boolean | object
  label: string | number
  disabled?: boolean
}
type Fn = (...args: any[]) => Promise<Group[] | Option[]>
export interface Group {
  label: string
  options: Option[]
  disabled?: boolean
}
export type SelectComponentOption = {
  [key: string]: any
  options?: Option[]
  groups?: Group[]
  request?: Fn
}
