import { buildProps, definePropType } from 'element-plus/es/utils/index'
import type {
  ButtonProps,
  ColProps,
  FormInstance,
  FormItemProps,
  FormProps,
  RowProps,
} from 'element-plus'
import type { Component, ExtractPropTypes } from 'vue'
export type Model = Record<string, any>
export type CustomFormProps = Partial<Omit<FormProps, 'model'>> & {
  label?: string
  hasFormBtns?: boolean
  border?: boolean
}
type CustomFormItemProps = Partial<FormItemProps> & {
  dependenciesRules?: () => FormItemProps['rules']
}
type CustomColProps = Partial<ColProps>
type CustomRowProps = Partial<RowProps>

export interface FieldsMap {
  [key: string]: FormItemOption
}
export interface ReflectionFieldMap {
  [key: string]: FormItemOption | undefined
}

export interface ReflectionModelMap {
  [key: string]: Model
}
export interface ReflectionOriginModelMap {
  [key: string]: Model
}

export interface FormRefItem {
  ref: FormInstance | null
  child: Record<string, FormInstance | null>
}

export type FormRefs = Record<string, FormRefItem>

export interface FormItemOption {
  type: string
  prop: string
  formProps?: CustomFormProps
  formItemProps?: CustomFormItemProps & {
    labelFunc?: () => string
    advReadonly?: boolean
  }
  rowProps?: CustomRowProps
  colProps?: CustomColProps
  componentProps?: {
    request?: (...args: any[]) => Promise<any>
    [key: string]: any
  }
  fields?: FormItemOption[]
  hasReset?: boolean
  hasFormBtns?: boolean
  btnsProps?: BtnsProps
  dependencies?: string[]
  condFunc?: () => boolean
  onSubmit?: OnSubmit
  onReset?: OnReset
}

type OnSubmit = () => Promise<any>
type OnReset = () => void

export interface BtnsProps {
  submitText?: string
  resetText?: string
  loadingIcon?: ButtonProps['loadingIcon']
}

export const advFormProps = buildProps({
  fields: {
    type: definePropType<FormItemOption[]>(Array),
    required: true,
  },
  model: {
    type: definePropType<Model>(Object),
    required: true,
  },
  formProps: {
    type: definePropType<CustomFormProps>(Object),
  },
  formItemProps: {
    type: definePropType<CustomFormItemProps>(Object),
  },
  rowProps: {
    type: definePropType<CustomRowProps>(Object),
  },
  colProps: {
    type: definePropType<CustomColProps>(Object),
  },
  btnsProps: {
    type: definePropType<BtnsProps>(Object),
  },
  hasReset: {
    type: Boolean,
    default: false,
  },
  hasFormBtns: {
    type: Boolean,
    default: false,
  },
  onReset: {
    type: definePropType<OnReset>(Function),
  },
  onSubmit: {
    type: definePropType<OnSubmit>(Function),
  },
  componentsMaps: {
    type: definePropType<Component>(Object),
  },
} as const)

export type AdvFormProps = ExtractPropTypes<typeof advFormProps>
