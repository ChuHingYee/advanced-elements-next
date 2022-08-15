import { defineComponent, inject } from 'vue'
import { ElButton } from 'element-plus'
import { advFormContextKey } from './tokens'
import type { AdvFormContext } from './tokens'
const AdvFormListBtn = defineComponent({
  name: 'AdvFormListBtn',
  props: {
    prop: {
      type: String,
      required: true,
    },
    buttonText: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const advFormContext = inject<AdvFormContext>(advFormContextKey)
    const handleAdd = () => {
      advFormContext?.updateForm(props.prop, 0)
    }
    return () => {
      return (
        <div class="adv-form--lbtn">
          <ElButton class="adv-form--lbtn__main" onClick={handleAdd}>
            {props.buttonText}
          </ElButton>
        </div>
      )
    }
  },
})

export default AdvFormListBtn
