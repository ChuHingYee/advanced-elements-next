import type { Component } from 'vue'
import type { FormItemOption, FormRefs } from './formWrap'
import type { ButtonProps, FormInstance } from 'element-plus'
export interface DefaultBtnsProps {
  submitText: string
  resetText: string
  loadingIcon?: ButtonProps['loadingIcon']
}
export const advFormContextKey = Symbol()
export const advFormRootPropKey = 'EAD0CC81-444E-ECED-8097-F934546454E7'
export const defaultBtnsProps: DefaultBtnsProps = {
  submitText: '提交',
  resetText: '重置',
}

export interface AdvFormContext {
  btnsProps: DefaultBtnsProps
  formProps: FormItemOption['formProps']
  model: Record<string, any>
  components: Component
  formRefs: FormRefs
  updateForm: (parentProp: string, type: 0 | 1, currentProp?: string) => void
  updateRefs: (name: string, el: FormInstance) => void
  updateModel: (model: Record<string, any>) => void
}
