import { buildProps, definePropType } from 'element-plus/es/utils/index'
import type { FormItemOption } from './formWrap'
import type { ExtractPropTypes } from 'vue'
export const advFormOption = buildProps({
  type: {
    type: definePropType<FormItemOption['type']>(String),
    required: true,
  },
  prop: {
    type: definePropType<FormItemOption['prop']>(String),
    required: true,
  },
  formProps: {
    type: definePropType<FormItemOption['formProps']>(Object),
  },
  formItemProps: {
    type: definePropType<FormItemOption['formItemProps']>(Object),
  },
  rowProps: {
    type: definePropType<FormItemOption['rowProps']>(Object),
  },
  colProps: {
    type: definePropType<FormItemOption['colProps']>(Object),
  },
  fields: {
    type: definePropType<FormItemOption['fields']>(Object),
  },
  btnsProps: {
    type: definePropType<FormItemOption['btnsProps']>(Boolean),
  },
  hasReset: {
    type: definePropType<FormItemOption['hasReset']>(Boolean),
  },
  onSubmit: {
    type: definePropType<FormItemOption['onSubmit']>(Function),
  },
  onReset: {
    type: definePropType<FormItemOption['onReset']>(Function),
  },
} as const)

export type AdvFormOption = ExtractPropTypes<typeof advFormOption>
