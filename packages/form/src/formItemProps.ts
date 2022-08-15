import { buildProps, definePropType } from 'element-plus/es/utils/index'
import type { FormItemOption } from './formWrap'
import type { ExtractPropTypes } from 'vue'
export const advFormItemProps = buildProps({
  prop: {
    type: definePropType<FormItemOption['prop']>(String),
    required: true,
  },
  originProp: {
    type: String,
    required: true,
  },
  type: {
    type: definePropType<FormItemOption['type']>(String),
    required: true,
  },
  formItemProps: {
    type: definePropType<FormItemOption['formItemProps']>(Object),
  },
  componentProps: {
    type: definePropType<FormItemOption['componentProps']>(Object),
  },
  dependencies: {
    type: definePropType<FormItemOption['dependencies']>(Array),
  },
} as const)

export type AdvFormItemProps = ExtractPropTypes<typeof advFormItemProps>
