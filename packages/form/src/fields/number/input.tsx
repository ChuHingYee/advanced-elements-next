import { defineComponent } from 'vue'
import { ElInputNumber } from 'element-plus'
import Readonly from '../readonly'
import useModel from '../../useModel'
const AdvFormFieldNumber = defineComponent({
  name: 'AdvFormFieldNumber',
  props: {
    advReadonly: {
      type: Boolean,
    },
    prop: {
      type: String,
      required: true,
    },
    componentProps: {
      type: Object,
    },
  },
  setup(props) {
    const { value } = useModel<number>(props.prop)
    return () => {
      if (props?.advReadonly) {
        const _text = String(value.value)
        return <Readonly text={_text}></Readonly>
      }
      return <ElInputNumber {...props.componentProps} v-model={value.value} />
    }
  },
})

export default AdvFormFieldNumber
