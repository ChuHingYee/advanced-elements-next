import { defineComponent } from 'vue'
import { DEFAULT_FORMATS_TIME, ElTimePicker } from 'element-plus'
import dayjs from 'dayjs'
import useModel from '../../useModel'
import Readonly from '../readonly'
import type { PropType } from 'vue'
const AdvFormFieldTimePicker = defineComponent({
  name: 'AdvFormFieldTimePicker',
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
    const format = props.componentProps.format ?? DEFAULT_FORMATS_TIME
    return () => {
      if (props?.advReadonly) {
        const text = value.value ? dayjs(value.value).format(format) : '-'
        return <Readonly text={text}></Readonly>
      }
      return <ElTimePicker {...props.componentProps} v-model={value.value} />
    }
  },
})

export default AdvFormFieldTimePicker
