<script lang="ts">
import { defineComponent, h, inject, resolveComponent } from 'vue'
import { ElFormItem } from 'element-plus'
import AdvInput from './fields/input/input'
import AdvNumber from './fields/number/input'
import AdvSelect from './fields/select/select'
import AdvRadio from './fields/radio/radio'
import AdvTimePicker from './fields/timePicker/timePicker'
import AdvDatePicker from './fields/datePicker/datePicker'
import AdvCheckbox from './fields/checkbox/checkbox'
import AdvSwitch from './fields/switch/switch'
import AdvRate from './fields/rate/rate'
import AdvColorPicker from './fields/colorPicker/colorPicker'
import AdvTreeSelect from './fields/treeSelect/treeSelect'
import { advFormContextKey } from './tokens'
import useModel from './useModel'
import { advFormItemProps } from './formItemProps'
import type { AdvFormContext } from './tokens'
const builtInMap = {
  input: 'AdvInput',
  number: 'AdvNumber',
  select: 'AdvSelect',
  radio: 'AdvRadio',
  timePicker: 'AdvTimePicker',
  datePicker: 'AdvDatePicker',
  switch: 'AdvSwitch',
  checkbox: 'AdvCheckbox',
  rate: 'AdvRate',
  colorPicker: 'AdvColorPicker',
  treeSelect: 'AdvTreeSelect',
}
export default defineComponent({
  name: 'AdvFormItem',
  components: {
    AdvInput,
    AdvNumber,
    AdvSelect,
    AdvRadio,
    AdvTimePicker,
    AdvDatePicker,
    AdvSwitch,
    AdvCheckbox,
    AdvRate,
    AdvColorPicker,
    AdvTreeSelect,
  },
  inheritAttrs: false,
  props: advFormItemProps,
  setup(props) {
    return () => {
      const dependenciesObj: Record<string, any> = {}
      const advFormContext = inject<AdvFormContext>(advFormContextKey)
      const { label, labelFunc, dependenciesRules, rules, ...rest } =
        props.formItemProps || {}
      const _label = labelFunc ? labelFunc() : label
      const _rules = dependenciesRules ? dependenciesRules() : rules
      if (props.dependencies) {
        props.dependencies.forEach((dependence) => {
          const { value } = useModel<any>(dependence)
          dependenciesObj[dependence] = value.value || ''
        })
      }
      return h(
        ElFormItem,
        {
          prop: props.originProp,
          label: _label,
          rules: _rules,
          ...rest,
        },
        {
          default: () => {
            return builtInMap[props.type]
              ? h(resolveComponent(builtInMap[props.type]), {
                  prop: props.prop,
                  advReadonly: props.formItemProps?.advReadonly,
                  componentProps: props.componentProps,
                  dependencies: dependenciesObj,
                })
              : advFormContext?.components &&
                advFormContext?.components[props.type]
              ? h(advFormContext?.components[props.type], {
                  prop: props.prop,
                  advReadonly: props.formItemProps?.advReadonly,
                  componentProps: props.componentProps,
                  dependencies: dependenciesObj,
                })
              : []
          },
        }
      )
    }
  },
})
</script>
