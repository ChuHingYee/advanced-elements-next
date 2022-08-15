import { defineComponent } from 'vue'
import {
  DEFAULT_FORMATS_DATE,
  DEFAULT_FORMATS_DATEPICKER,
  ElDatePicker,
} from 'element-plus'
import dayjs from 'dayjs'
import useModel from '../../useModel'
import Readonly from '../readonly'
import type { PropType } from 'vue'
const AdvFormFieldDatePicker = defineComponent({
  name: 'AdvFormFieldDatePicker',
  props: {
    advReadonly: {
      type: Boolean,
    },
    prop: {
      type: String,
      required: true,
    },
    componentProps: {
      type: Object as PropType<any>,
    },
  },
  setup(props) {
    const { value } = useModel<any>(props.prop)
    const format =
      props.componentProps.format ??
      (DEFAULT_FORMATS_DATEPICKER[props.componentProps.type] ||
        DEFAULT_FORMATS_DATE)
    return () => {
      if (props?.advReadonly) {
        const text = value.value ? dayjs(value.value).format(format) : '-'
        return <Readonly text={text}></Readonly>
      }
      return <ElDatePicker {...props.componentProps} v-model={value.value} />
    }
  },
})

export default AdvFormFieldDatePicker
