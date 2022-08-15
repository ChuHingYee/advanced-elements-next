import { defineComponent, ref, watch } from 'vue'
import { ElOption, ElOptionGroup, ElSelect } from 'element-plus'
import useModel from '../../useModel'
import Readonly from '../readonly'
import type { Group, Option, SelectComponentOption } from './selectProps'
import type { PropType } from 'vue'
const AdvFormFieldSelect = defineComponent({
  name: 'AdvFormFieldSelect',
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
      type: Object as PropType<SelectComponentOption>,
    },
  },
  setup(props) {
    const { value } = useModel<Option['value']>(props.prop)
    const localData = ref<
      SelectComponentOption['groups'] | SelectComponentOption['options']
    >([])
    const isRequesting = ref(false)
    const getLabel = (list: Option[], value) => {
      const current = list.find((option) => {
        return option.value === value
      })
      return current?.label ? String(current?.label) : '-'
    }
    const request = () => {
      if (props?.componentProps?.request && !isRequesting.value) {
        let params: any = {}
        if (props.dependencies) {
          params = { ...params, ...props.dependencies }
        }
        isRequesting.value = true
        props?.componentProps
          ?.request(params)
          .then((res) => {
            if (res && res[0]) {
              if ((res[0] as Group).options) {
                localData.value = res
              } else {
                localData.value = [
                  {
                    label: '',
                    options: res as Option[],
                  },
                ]
              }
            }
          })
          .finally(() => {
            isRequesting.value = false
          })
      }
    }
    watch(
      () => {
        return props?.componentProps?.groups
      },
      (val) => {
        if (val && val.length) {
          localData.value = val
        }
      },
      {
        immediate: true,
      }
    )
    watch(
      () => {
        return props?.componentProps?.options
      },
      (val) => {
        if (val && val.length) {
          localData.value = [
            {
              label: '',
              options: val,
            },
          ]
        }
      },
      {
        immediate: true,
      }
    )
    watch(
      () => {
        return [
          props?.componentProps?.request,
          props.dependencies,
          props.dependencies,
        ]
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
        let currentValue: string | number = ''
        if (localData.value && localData.value.length) {
          const list: Option[] = []
          localData.value.forEach((group) => {
            list.push(...group.options)
          })
          currentValue = getLabel(list, value.value)
        } else {
          currentValue = '-'
        }
        return <Readonly text={currentValue}></Readonly>
      }
      return (
        <ElSelect
          {...props.componentProps}
          v-model={value.value}
          loading={isRequesting.value}
        >
          {localData.value &&
            localData.value.length &&
            localData.value.map((group) => {
              return (
                <ElOptionGroup key={group.label} label={group.label}>
                  {group.options.map((option) => {
                    return (
                      <ElOption
                        key={option.label}
                        label={option.label}
                        value={option.value}
                      />
                    )
                  })}
                </ElOptionGroup>
              )
            })}
        </ElSelect>
      )
    }
  },
})

export default AdvFormFieldSelect
