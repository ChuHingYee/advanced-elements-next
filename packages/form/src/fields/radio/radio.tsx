import { defineComponent, ref, watch } from 'vue'
import { ElRadio, ElRadioGroup } from 'element-plus'
import useModel from '../../useModel'
import Readonly from '../readonly'
import type { Option, RadioComponentOption, RadioValue } from './radioProps'
import type { PropType } from 'vue'
const AdvFormFieldRadio = defineComponent({
  name: 'AdvFormFieldRadio',
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
      type: Object as PropType<RadioComponentOption>,
      default: () => {
        return {}
      },
    },
  },
  setup(props) {
    const { value } = useModel<RadioValue>(props.prop)
    const localData = ref<RadioComponentOption['options']>([])
    const getLabel = (list: Option[], value) => {
      const current = list.find((option) => {
        return option.label === value
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
        let currentValue: RadioValue
        if (localData.value && localData.value.length) {
          currentValue = getLabel(localData.value, value.value)
        } else {
          currentValue = '-'
        }
        return <Readonly text={currentValue}></Readonly>
      }
      return (
        <ElRadioGroup {...props.componentProps} v-model={value.value}>
          {localData.value &&
            localData.value.length &&
            localData.value.map((option) => {
              return <ElRadio key={String(option.label)} label={option.label} />
            })}
        </ElRadioGroup>
      )
    }
  },
})

export default AdvFormFieldRadio
