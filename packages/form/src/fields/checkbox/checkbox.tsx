import { defineComponent, ref, watch } from 'vue'
import { ElCheckbox, ElCheckboxGroup } from 'element-plus'
import useModel from '../../useModel'
import Readonly from '../readonly'
import type {
  CheckboxComponentOption,
  CheckboxOptionProps,
  ModelValue,
} from './checkboxProps'
import type { PropType } from 'vue'
const AdvFormFieldCheckbox = defineComponent({
  name: 'AdvFormFieldCheckbox',
  props: {
    advReadonly: {
      type: Boolean,
    },
    prop: {
      type: String,
      required: true,
    },
    dependencies: {
      type: Object,
    },
    componentProps: {
      type: Object as PropType<CheckboxComponentOption>,
      default: () => {
        return {}
      },
    },
  },
  setup(props) {
    const { value } = useModel<ModelValue>(props.prop)
    const localData = ref<CheckboxComponentOption['options']>([])
    const getLabel = (list: CheckboxOptionProps[]): string => {
      const current = list.find((option) => {
        const _label = option.trueLabel || option.label
        return _label === value.value
      })
      return current?.label ? String(current?.label) : '-'
    }
    const request = () => {
      if (props.componentProps.request) {
        let params: any = {}
        if (props.dependencies) {
          params = { ...params, ...props.dependencies }
        }
        props.componentProps.request(params).then((res) => {
          localData.value = res
        })
      }
    }
    watch(
      () => {
        return props?.componentProps?.options
      },
      (val) => {
        if (val && val.length) {
          localData.value = props.componentProps.options
        }
      },
      {
        immediate: true,
      }
    )
    watch(
      () => {
        return [props?.componentProps?.request, props.dependencies]
      },
      () => {
        request()
      },
      {
        immediate: true,
      }
    )
    return () => {
      if (props?.advReadonly) {
        let currentValue: ModelValue
        if (localData.value && localData.value.length) {
          currentValue = getLabel(localData.value)
        } else {
          currentValue = '-'
        }
        return <Readonly text={currentValue}></Readonly>
      }
      return (
        <ElCheckboxGroup {...props.componentProps} v-model={value.value}>
          {localData.value &&
            localData.value.length &&
            localData.value.map((option) => {
              return <ElCheckbox key={String(option.label)} {...option} />
            })}
        </ElCheckboxGroup>
      )
    }
  },
})

export default AdvFormFieldCheckbox
