import { defineComponent, ref } from 'vue'
import { ElInput } from 'element-plus'
import Readonly from '../readonly'
import useModel from '../../useModel'
const AdvFormFieldInput = defineComponent({
  name: 'AdvFormFieldInput',
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
    const isVisible = ref(false)
    const { value } = useModel<string>(props.prop)
    const triggerIsVisible = () => {
      isVisible.value = !isVisible.value
    }
    return () => {
      if (props?.advReadonly) {
        const text = isVisible.value ? value.value : '-'
        return <Readonly text={text} onAdvClick={triggerIsVisible}></Readonly>
      }
      return <ElInput {...props.componentProps} v-model={value.value} />
    }
  },
})

export default AdvFormFieldInput
