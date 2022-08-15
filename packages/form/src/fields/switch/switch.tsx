import { defineComponent } from 'vue'
import { ElSwitch } from 'element-plus'
import Readonly from '../readonly'
import useModel from '../../useModel'
const AdvFormFieldSwitch = defineComponent({
  name: 'AdvFormFieldSwitch',
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
        let text = ''
        const isBoolean =
          Object.prototype.toString.call(value.value) === '[object Boolean]'
        if (isBoolean) {
          text = isBoolean
            ? props.componentProps?.activeText
            : props.componentProps?.inActiveText
        } else {
          text = value.value
        }
        return <Readonly text={text}></Readonly>
      }
      return <ElSwitch {...props.componentProps} v-model={value.value} />
    }
  },
})

export default AdvFormFieldSwitch
