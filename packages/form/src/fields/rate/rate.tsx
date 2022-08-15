import { defineComponent } from 'vue'
import { ElRate } from 'element-plus'
import Readonly from '../readonly'
import useModel from '../../useModel'
import type { PropType } from 'vue'
import type { RateProps } from 'element-plus'
const AdvFormFieldRate = defineComponent({
  name: 'AdvFormFieldRate',
  props: {
    advReadonly: {
      type: Boolean,
    },
    prop: {
      type: String,
      required: true,
    },
    componentProps: {
      type: Object as PropType<RateProps>,
    },
  },
  setup(props) {
    const { value } = useModel<number>(props.prop)
    return () => {
      if (props?.advReadonly) {
        let _text = String(value.value)
        if (
          props?.componentProps?.showScore &&
          props?.componentProps?.scoreTemplate
        ) {
          _text = props.componentProps.scoreTemplate.replace(
            /\{\s*value\s*\}/,
            _text
          )
        } else if (props?.componentProps?.showText) {
          _text = props.componentProps?.texts[Math.ceil(value.value) - 1]
        }
        return <Readonly text={_text}></Readonly>
      }
      return <ElRate {...props.componentProps} v-model={value.value} />
    }
  },
})

export default AdvFormFieldRate
