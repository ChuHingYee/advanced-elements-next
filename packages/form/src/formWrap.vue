<template>
  <AdvForm v-bind="formOption" ref="rootFormRef" />
</template>

<script lang="ts" setup>
import { computed, provide, ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import AdvForm from './form'
import { advFormProps } from './formWrap'
import {
  advFormContextKey,
  advFormRootPropKey,
  defaultBtnsProps,
} from './tokens'
import { getValue } from './utils'
import type {
  FieldsMap,
  FormItemOption,
  FormRefs,
  Model,
  ReflectionFieldMap,
  ReflectionModelMap,
  ReflectionOriginModelMap,
} from './formWrap'
import type { FormInstance } from 'element-plus'

const props = defineProps(advFormProps)
const emit = defineEmits<{
  (e: 'update:model', val: object): void
}>()
const rootFormRef = ref()
const formRefs = ref<FormRefs>({})
const fieldsMap = ref<FieldsMap>({})
const reflectionFieldMap = ref<ReflectionFieldMap>({})
const reflectionModelMap = ref<ReflectionModelMap>({})
const reflectionOriginModelMap = ref<ReflectionOriginModelMap>({})

const formOption = ref<FormItemOption | any>({})
const modelProxy = computed<Model>(() => {
  return props.model || {}
})
async function validate() {
  return rootFormRef.value.validates()
}
async function resetFields() {
  if (rootFormRef.value) {
    rootFormRef.value.resetFields()
  }
}
function updateModel(val: Record<string, any>) {
  emit('update:model', val)
}
function updateRefs(name: string, el: FormInstance | null) {
  const lastIndex = name.lastIndexOf('/')
  if (name !== advFormRootPropKey) {
    if (lastIndex !== -1) {
      const parentId = name.slice(0, Math.max(0, lastIndex))
      if (formRefs.value[parentId]) {
        formRefs.value[parentId].child[name] = el
      } else {
        formRefs.value[parentId] = {
          ref: null,
          child: {
            [name]: el,
          },
        }
      }
    } else {
      if (formRefs.value[advFormRootPropKey]) {
        formRefs.value[advFormRootPropKey].child[name] = el
      } else {
        formRefs.value[advFormRootPropKey] = {
          ref: null,
          child: {
            [name]: el,
          },
        }
      }
    }
  }
  if (formRefs.value[name]) {
    formRefs.value[name].ref = el
  } else {
    formRefs.value[name] = {
      ref: el,
      child: {},
    }
  }
}
function updateForm(parentProp: string, type: 0 | 1, currentProp: string) {
  if (reflectionFieldMap.value[parentProp]) {
    if (type === 0) {
      fieldsMap.value[parentProp].fields?.push(
        reflectionFieldMap.value[parentProp] as FormItemOption
      )
      reflectionModelMap.value[parentProp].push(
        cloneDeep(reflectionOriginModelMap.value[parentProp])
      )
    } else {
      const _index = Number(currentProp)
      fieldsMap.value[parentProp].fields?.splice(_index, 1)
      reflectionModelMap.value[parentProp].splice(_index, 1)
      updateRefs(`${parentProp}/${currentProp}`, null)
    }
  }
}

function formatFieldsMap(
  fields: FormItemOption[],
  fieldsMap: FieldsMap,
  reflection: ReflectionFieldMap,
  lastProp = ''
) {
  fields.forEach((item) => {
    const combineProp = lastProp ? `${lastProp}/${item.prop}` : item.prop
    if (item.type === 'formList') {
      item.formProps = {
        ...item.formProps,
        border: item.formProps?.border || item.type === 'formList',
      }
      fieldsMap[combineProp] = item
      reflection[combineProp] = item.fields && item.fields[0]
    }
    if (item.fields && item.fields.length) {
      formatFieldsMap(item.fields, fieldsMap, reflection, item.prop)
    }
  })
}
function initFields() {
  const _fieldsMap = {}
  const _reflectionFieldsMap = {}
  const _reflectionOriginModelMap = {}
  const _reflectionModelMap = {}
  formatFieldsMap(props.fields, _fieldsMap, _reflectionFieldsMap)
  Object.keys(_reflectionFieldsMap).forEach((key) => {
    const result = getValue(modelProxy.value, key)
    _reflectionOriginModelMap[key] = result[0] ? cloneDeep(result[0]) : null
    _reflectionModelMap[key] = result
  })
  reflectionFieldMap.value = _reflectionFieldsMap
  reflectionModelMap.value = _reflectionModelMap
  reflectionOriginModelMap.value = _reflectionOriginModelMap
  fieldsMap.value = _fieldsMap
  const {
    formProps,
    formItemProps,
    colProps,
    rowProps,
    fields,
    hasReset,
    onSubmit,
    onReset,
  } = props
  formOption.value = {
    type: 'form',
    prop: advFormRootPropKey,
    formProps,
    formItemProps,
    rowProps,
    colProps,
    fields,
    hasReset,
    onSubmit,
    onReset,
  }
}

initFields()

provide(advFormContextKey, {
  model: modelProxy,
  btnsProps: {
    ...defaultBtnsProps,
    ...props.btnsProps,
  },
  formProps: {
    ...props.formProps,
  },
  components: props.componentsMaps,
  updateRefs,
  updateModel,
  updateForm,
  formRefs,
})
defineExpose({
  validate,
  resetFields,
  formRefs,
})
</script>

<script lang="ts">
export default {
  name: 'AdvForm',
}
</script>
