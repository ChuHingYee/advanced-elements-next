import { computed, defineComponent, inject, ref, watch } from 'vue'
import { ElButton, ElCol, ElForm, ElFormItem, ElRow } from 'element-plus'
import AdvFormItem from './formItem.vue'
import { advFormOption } from './formProp'
import {
  advFormContextKey,
  advFormRootPropKey,
  defaultBtnsProps,
} from './tokens'
import { getParentProp } from './utils'
import useModel from './useModel'
import type { FormRefItem } from './formWrap'
import type { FormInstance, FormValidateFailure } from 'element-plus'
import type { AdvFormContext } from './tokens'
import './style/form.scss'

type ValidateTask = Promise<boolean | FormValidateFailure['fields']>

const AdvForm = defineComponent({
  name: 'AdvElForm',
  props: advFormOption,
  setup(props, { expose }) {
    const advFormContext = inject<AdvFormContext>(advFormContextKey)
    const elformRef = ref<FormInstance>()
    const isSubmitting = ref(false)
    const formModel = computed(() => {
      if (props.prop !== advFormRootPropKey) {
        const { value } = useModel(props.prop)
        return value.value
      } else {
        return advFormContext?.model.value || {}
      }
    })
    const combineFormProps = computed(() => {
      return {
        ...advFormContext?.formProps,
        ...props.formProps,
      }
    })
    const hasSubmitBtn = computed(() => {
      return !!props.onSubmit
    })
    const submitText = computed(() => {
      return (
        props.btnsProps?.submitText ||
        advFormContext?.btnsProps.submitText ||
        defaultBtnsProps.submitText
      )
    })
    const resetText = computed(() => {
      return (
        props.btnsProps?.resetText ||
        advFormContext?.btnsProps.resetText ||
        defaultBtnsProps.resetText
      )
    })
    const loadingIcon = computed(() => {
      return (
        props.btnsProps?.loadingIcon ||
        advFormContext?.btnsProps.loadingIcon ||
        null
      )
    })

    function handleRefValidate(formRef: FormRefItem, tasks: ValidateTask[]) {
      tasks.push(validate(formRef.ref))
      if (formRef.child) {
        Object.keys(formRef.child).forEach((key) => {
          tasks.push(validate(formRef.child[key]))
          if (advFormContext?.formRefs.value[key]) {
            handleRefValidate(advFormContext?.formRefs.value[key], tasks)
          }
        })
      }
    }
    async function validates(): Promise<
      boolean | FormValidateFailure['fields']
    > {
      const tasks: ValidateTask[] = []
      const _formRef = advFormContext?.formRefs.value[props.prop]
      if (_formRef) {
        handleRefValidate(_formRef, tasks)
      }
      try {
        const result = await Promise.all(tasks)
        return result.every((item) => item === true)
      } catch (error) {
        return error as FormValidateFailure['fields']
      }
    }
    async function validate(form: FormInstance | null): ValidateTask {
      return new Promise<boolean | FormValidateFailure['fields']>(
        (resolve, reject) => {
          if (!form) {
            reject(false)
          } else {
            form.validate((valid, fields) => {
              if (valid) {
                resolve(true)
              } else {
                reject(fields)
              }
            })
          }
        }
      )
    }
    function handleRefResetFields(form: FormRefItem) {
      form.ref && form.ref.resetFields()
      if (form.child) {
        Object.keys(form.child).forEach((key) => {
          const _childFormRef = advFormContext?.formRefs.value[key]
          if (_childFormRef) {
            handleRefResetFields(_childFormRef)
          }
        })
      }
    }
    function resetFields() {
      const _formRef = advFormContext?.formRefs.value[props.prop]
      if (_formRef && props.hasReset) {
        handleRefResetFields(_formRef)
      }
    }
    async function onSubmit() {
      if (elformRef.value && props.onSubmit) {
        const value = await validates()
        if (value === true) {
          isSubmitting.value = true
          props.onSubmit().finally(() => {
            isSubmitting.value = false
          })
        }
      }
    }
    function handleFormChange(flag: 0 | 1, prop = '') {
      if (prop) {
        advFormContext?.updateForm(prop, flag)
      } else {
        const propInfo = getParentProp(props.prop)
        if (propInfo) {
          advFormContext?.updateForm(propInfo.parent, flag, propInfo.current)
        }
      }
    }
    watch(
      () => {
        return elformRef
      },
      (val) => {
        if (val.value) {
          advFormContext?.updateRefs(props.prop, val.value)
        }
      },
      {
        immediate: true,
        deep: true,
      }
    )
    watch(
      () => {
        return props
      },
      () => {
        if (elformRef.value) {
          advFormContext?.updateRefs(props.prop, elformRef.value)
        }
      },
      {
        deep: true,
        flush: 'post',
      }
    )
    expose({
      validates,
      resetFields,
      onSubmit,
    })
    return () => {
      const loadingBtnProp: any = {
        loading: isSubmitting.value,
      }
      if (loadingIcon.value) {
        loadingBtnProp.loadingIcon = loadingIcon.value
      }
      if (!advFormContext) {
        return
      }
      return (
        <div class="adv-form">
          {combineFormProps.value?.label && (
            <div class="adv-form--header">
              <span class="header-label">
                {combineFormProps.value?.label}ss
                {combineFormProps.value.hasFormBtns}
              </span>
              {combineFormProps.value.hasFormBtns && (
                <div class="header-btns">
                  <svg
                    onClick={handleFormChange.bind(this, 0, '')}
                    class="header-btns--icon"
                    viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg"
                    data-v-78e17ca8=""
                  >
                    <path
                      fill="currentColor"
                      d="M768 832a128 128 0 0 1-128 128H192A128 128 0 0 1 64 832V384a128 128 0 0 1 128-128v64a64 64 0 0 0-64 64v448a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64h64z"
                    ></path>
                    <path
                      fill="currentColor"
                      d="M384 128a64 64 0 0 0-64 64v448a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64V192a64 64 0 0 0-64-64H384zm0-64h448a128 128 0 0 1 128 128v448a128 128 0 0 1-128 128H384a128 128 0 0 1-128-128V192A128 128 0 0 1 384 64z"
                    ></path>
                  </svg>
                  <svg
                    onClick={handleFormChange.bind(this, 1, '')}
                    class="header-btns--icon"
                    viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg"
                    data-v-78e17ca8=""
                  >
                    <path
                      fill="currentColor"
                      d="M160 256H96a32 32 0 0 1 0-64h256V95.936a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V192h256a32 32 0 1 1 0 64h-64v672a32 32 0 0 1-32 32H192a32 32 0 0 1-32-32V256zm448-64v-64H416v64h192zM224 896h576V256H224v640zm192-128a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32zm192 0a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32z"
                    ></path>
                  </svg>
                </div>
              )}
            </div>
          )}
          <div
            class={[
              'adv-form--container',
              props.formProps?.border ? 'adv-form--container__border' : '',
            ]}
          >
            {/* {JSON.stringify(formModel.value)} */}
            <ElForm
              ref={elformRef}
              model={formModel.value}
              {...combineFormProps.value}
              key={props.prop}
            >
              <ElRow {...props.rowProps}>
                {props.fields &&
                  props.fields.map((item, index) => {
                    const flag = item.condFunc ? item.condFunc() : true
                    const combineProp =
                      props.type === 'formList'
                        ? `${props.prop}/${index}`
                        : props.type === 'form' &&
                          props.prop !== advFormRootPropKey
                        ? `${props.prop}/${item.prop}`
                        : item.prop
                    const customProps = {
                      ...item,
                      prop: combineProp,
                      originProp: item.prop,
                      formProps: {
                        ...item.formProps,
                        hasFormBtns: props.type === 'formList',
                      },
                    }
                    return flag ? (
                      <ElCol {...item.colProps}>
                        {item.type !== 'form' && item.type !== 'formList' ? (
                          <AdvFormItem {...customProps}></AdvFormItem>
                        ) : item.type === 'form' ? (
                          <AdvForm {...customProps}></AdvForm>
                        ) : (
                          <div class="adv-form">
                            {item.formItemProps?.label && (
                              <div class="adv-form--header">
                                <div class="header-label">
                                  {item.formItemProps?.label}
                                </div>
                              </div>
                            )}
                            <div class="adv-form--container">
                              <AdvForm {...customProps}></AdvForm>
                              <div class="adv-form--lbtn">
                                <ElButton
                                  class="adv-form--lbtn__main"
                                  onClick={handleFormChange.bind(
                                    this,
                                    0,
                                    combineProp
                                  )}
                                >
                                  新增
                                </ElButton>
                              </div>
                            </div>
                          </div>
                        )}
                      </ElCol>
                    ) : null
                  })}
                {(props.hasReset || hasSubmitBtn.value) && (
                  <ElCol>
                    <ElFormItem>
                      {hasSubmitBtn.value && (
                        <ElButton {...loadingBtnProp} onClick={onSubmit}>
                          {submitText.value}
                        </ElButton>
                      )}
                      {props.hasReset && (
                        <ElButton
                          disabled={isSubmitting.value}
                          onClick={resetFields}
                        >
                          {resetText.value}
                        </ElButton>
                      )}
                    </ElFormItem>
                  </ElCol>
                )}
              </ElRow>
            </ElForm>
          </div>
        </div>
      )
    }
  },
})

export default AdvForm
