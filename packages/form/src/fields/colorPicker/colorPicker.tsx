import { defineComponent } from 'vue'
import { ElColorPicker } from 'element-plus'
import Readonly from '../readonly'
import useModel from '../../useModel'
const AdvFormFieldColorPicker = defineComponent({
  name: 'AdvFormFieldColorPicker',
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
    const { value } = useModel<string>(props.prop)
    return () => {
      if (props?.advReadonly) {
        return <Readonly text={value.value}></Readonly>
      }
      return <ElColorPicker {...props.componentProps} v-model={value.value} />
    }
  },
})

export default AdvFormFieldColorPicker
