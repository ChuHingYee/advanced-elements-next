export interface Option {
  label: string | number | boolean
}
type Fn = (...args: any[]) => Promise<Option[]>

export type RadioComponentOption = {
  [key: string]: any
  options?: Option[]
  request?: Fn
}

export type RadioValue = string | number | boolean
