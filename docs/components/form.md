# adv-form 表单

封装于 el-form，在不破坏其原有功能基础上,利用 JSON Schema 来生成表单的工具。

## 安装

```shell
# 选择一个你喜欢的包管理器

# NPM
$ npm install @advanced-elements/form --save
# Yarn
$ yarn add @advanced-elements/form
# pnpm
$ pnpm add @advanced-elements/form
```

## 代码示例

<script setup>
import { defineComponent, reactive, ref } from 'vue'
const formRef = ref()
const submitProp = ref({
  submitText: 'submit',
})
const maps = {}
const request = (params) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          value: 'Option1',
          label: 'Option1',
        },
        {
          value: 'Option2',
          label: params ? params.select3 : 'Option2',
        },
      ])
    }, 3000)
  })
}
const list = ref([
  {
    prop: 'input1',
    type: 'input',
    formItemProps: {
      label: 'input1',
      // labelWidth: 'auto',
    },
    componentProps: {
      showPassword: true,
    },
    colProps: {
      span: 12,
    },
  },
  {
    prop: 'input2',
    type: 'input',
    formItemProps: {
      label: 'input2',
    },
    componentProps: {
      showPassword: true,
    },
    condFunc: () => {
      return modelForm.value.input1.length > 5
    },
    colProps: {
      span: 12,
    },
  },
  {
    prop: 'input3',
    type: 'input',
    formItemProps: {
      label: 'input3',
      labelFunc: () => {
        return `input1关联:${modelForm.value.input1}`
      },
      advReadonly: true,
    },
    componentProps: {},
    colProps: {
      span: 3,
    },
  },
  {
    prop: 'select1',
    type: 'select',
    formItemProps: {
      label: 'select1',
      advReadonly: true,
    },
    componentProps: {
      options: [
        {
          value: 'Option1',
          label: 'Option1',
        },
        {
          value: 'Option2',
          label: 'Option2',
        },
      ],
    },
  },
  {
    prop: 'select2',
    type: 'select',
    formItemProps: {
      label: 'select2',
      dependenciesRules: () => {
        if (modelForm.value.input1) {
          return {
            required: true,
            message: 'Please select Activity zone',
            trigger: 'change',
          }
        } else {
          return {}
        }
      },
    },
    componentProps: {
      request,
    },
    dependencies: ['select3', 'form1/input1'],
  },
  {
    prop: 'select3',
    type: 'select',
    formItemProps: {
      label: 'select3',
    },
    componentProps: {
      groups: [
        {
          label: 'Popular cities',
          options: [
            {
              value: 'Shanghai',
              label: 'Shanghai',
            },
            {
              value: 'Beijing',
              label: 'Beijing',
            },
          ],
        },
        {
          label: 'City name',
          options: [
            {
              value: 'Chengdu',
              label: 'Chengdu',
            },
            {
              value: 'Shenzhen',
              label: 'Shenzhen',
            },
          ],
        },
      ],
    },
  },
  {
    prop: 'radio1',
    type: 'radio',
    formItemProps: {
      label: 'radio1',
    },
    componentProps: {
      options: [
        {
          label: 'Shanghai',
        },
        {
          label: 'Beijing',
        },
      ],
    },
  },
  {
    prop: 'radio2',
    type: 'radio',
    formItemProps: {
      label: 'radio2',
    },
    componentProps: {
      request: (params) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                label: 'Shanghai',
              },
              {
                label: 'Beijing',
              },
            ])
          }, 3000)
        })
      },
    },
  },
  {
    prop: 'checkbox1',
    type: 'checkbox',
    formItemProps: {
      label: 'checkbox1',
    },
    componentProps: {
      request: (params) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                label: 'Shanghai',
              },
              {
                label: 'Beijing',
              },
            ])
          }, 3000)
        })
      },
    },
  },
  {
    prop: 'checkbox2',
    type: 'checkbox',
    formItemProps: {
      label: 'checkbox2',
    },
    componentProps: {
      options: [
        {
          label: 'Shanghai',
        },
        {
          label: 'Beijing',
        },
      ],
    },
  },
  {
    prop: 'number1',
    type: 'number',
    formItemProps: {
      label: 'number1',
    },
    componentProps: {},
  },
  {
    prop: 'colorPicker1',
    type: 'colorPicker',
    formItemProps: {
      label: 'colorPicker1',
    },
    componentProps: {},
  },
  {
    prop: 'colorPicker2',
    type: 'colorPicker',
    formItemProps: {
      label: 'colorPicker2',
      advReadonly: true,
    },
    componentProps: {},
  },
  {
    prop: 'treeSelect1',
    type: 'treeSelect',
    formItemProps: {
      label: 'treeSelect1',
    },
    componentProps: {
      data: [
        {
          value: '1',
          label: 'Level one 1',
          children: [
            {
              value: '1-1',
              label: 'Level two 1-1',
              children: [
                {
                  value: '1-1-1',
                  label: 'Level three 1-1-1',
                },
              ],
            },
          ],
        },
        {
          value: '2',
          label: 'Level one 2',
          children: [
            {
              value: '2-1',
              label: 'Level two 2-1',
              children: [
                {
                  value: '2-1-1',
                  label: 'Level three 2-1-1',
                },
              ],
            },
            {
              value: '2-2',
              label: 'Level two 2-2',
              children: [
                {
                  value: '2-2-1',
                  label: 'Level three 2-2-1',
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    prop: 'rate1',
    type: 'rate',
    formItemProps: {
      label: 'rate1',
    },
    componentProps: {},
  },
  {
    prop: 'rate2',
    type: 'rate',
    formItemProps: {
      label: 'rate2',
      advReadonly: true,
    },
    componentProps: {
      showScore: true,
      scoreTemplate: '{value} points',
      texts: ['oops', 'disappointed', 'normal', 'good', 'great'],
    },
  },
  {
    prop: 'switch2',
    type: 'switch',
    formItemProps: {
      label: 'switch2',
    },
    componentProps: {
      activeText: 'switchtrue',
      inactiveText: 'switchfalse',
    },
  },
  {
    prop: 'switch1',
    type: 'switch',
    formItemProps: {
      label: 'switch1',
    },
    componentProps: {
      activeText: '是',
      inactiveText: '否',
    },
  },
  {
    prop: 'input5',
    type: 'test1',
    formItemProps: {
      label: 'test1-custom',
    },
    componentProps: {
      showPassword: true,
    },
  },
  {
    prop: 'timePicker1',
    type: 'timePicker',
    formItemProps: {
      label: 'timePicker1',
    },
    componentProps: {
      isRange: true,
    },
  },
  {
    prop: 'timePicker2',
    type: 'timePicker',
    formItemProps: {
      label: 'timePicker2',
      advReadonly: true,
    },
    componentProps: {},
  },
  {
    prop: 'datePicker2',
    type: 'datePicker',
    formItemProps: {
      label: 'datePicker2',
    },
    componentProps: {
      type: 'month',
    },
  },
  {
    type: 'form',
    prop: 'form1',
    formProps: {
      rules: {
        input1: [
          {
            required: true,
            message: 'Please input input1',
            trigger: 'blur',
          },
        ],
      },
      label: '测试form1',
    },
    fields: [
      {
        prop: 'input1',
        type: 'input',
        colProps: {
          span: 6,
        },
        formItemProps: {
          label: 'form1-input1',
          labelWidth: 'auto',
        },
        componentProps: {
          showPassword: true,
        },
      },
      {
        prop: 'input2',
        type: 'input',
        formItemProps: {
          label: 'form1-input2',
          advReadonly: true,
          labelWidth: 'auto',
        },
        colProps: {
          span: 6,
        },
        componentProps: {
          showPassword: true,
        },
      },
      {
        prop: 'input3',
        type: 'input',
        formItemProps: {
          label: 'form1-input3',
        },
        componentProps: {
          showPassword: true,
        },
        condFunc: () => {
          return modelForm.value.input1.length > 5
        },
      },
      {
        prop: 'timePicker1',
        type: 'timePicker',
        formItemProps: {
          label: 'timePicker1',
        },
        componentProps: {
          isRange: true,
        },
      },
    ],
    hasReset: true,
  },
  {
    type: 'formList',
    prop: 'formList1',
    formProps: {
      rules: {
        input1: [
          {
            required: true,
            message: 'Please input input1',
            trigger: 'blur',
          },
        ],
      },
      hasReset: true,
      label: 'formlist',
    },
    fields: [
      {
        type: 'form',
        prop: 'form1',
        formProps: {
          rules: {
            input1: [
              {
                required: true,
                message: 'Please input input1',
                trigger: 'blur',
              },
            ],
          },
          label: 'formlist-form',
          hasReset: true,
        },
        fields: [
          {
            prop: 'input1',
            type: 'input',
            colProps: {
              span: 12,
            },
            formItemProps: {
              label: 'form1-input1',
              labelWidth: 'auto',
            },
            componentProps: {
              showPassword: true,
            },
          },
          {
            prop: 'input2',
            type: 'input',
            colProps: {
              span: 12,
            },
            formItemProps: {
              label: 'form1-input2',
              labelWidth: 'auto',
            },
            componentProps: {
              showPassword: true,
            },
          },
        ],
      },
    ],
  },
])
const modelForm = ref({
  input1: 'input1',
  input2: '',
  input3: 'input3',
  radio1: '',
  radio2: '',
  select1: 'Option1',
  select2: 'Option1',
  number: null,
  switch1: true,
  switch2: 'switchtrue',
  timePicker1: null,
  timePicker2: new Date(),
  datePicker2: null,
  checkbox1: [],
  checkbox2: [],
  rate1: null,
  rate2: 3,
  colorPicker1: null,
  colorPicker2: '#A30F0F',
  treeSelect1: null,
  form1: {
    input1: 'form1input1',
    input2: '',
    input3: 'form1input3',
    timePicker1: null,
  },
  formList1: [
    {
      input1: '',
      input2: '',
    },
  ],
})
const rules = reactive({
  input1: [
    {
      required: true,
      message: 'Please input Activity name',
      trigger: 'blur',
    },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
  radio21: [
    { required: true, message: 'Please input radio2', trigger: 'change' },
  ],
})
const handleSubmit = async () => {
  if (formRef.value) {
    const value = await formRef.value.validate()
    console.log(value)
    if (value === true) {
      console.log(modelForm.value)
      alert('外部提交成功')
    }
  }
}

const onSubmit = () => {
  return (
    new Promise((resolve) => {
      setTimeout(() => {
        modelForm.value.select1 = 'Option2'
        console.log(modelForm.value)
        alert('内部提交成功')
        resolve(true)
      }, 600)
    })
  )
}
</script>

<AdvForm
    ref="formRef"
    v-model:model="modelForm"
    :fields="list"
    :form-props="{
      rules,
      labelWidth: 'auto',
      inline: true,
    }"
    :row-props="{
      gutter: 20,
    }"
    :on-submit="onSubmit"
    :has-reset="true"
    :submit-prop="submitProp"
    :components-maps="maps"
  />
<ElButton @click="handleSubmit">外部提交</ElButton>

::: details 查看代码

```vue
<template>
  <AdvForm
    ref="formRef"
    v-model:model="modelForm"
    :fields="list"
    :form-props="{
      rules,
      labelWidth: 'auto',
      inline: true,
    }"
    :row-props="{
      gutter: 20,
    }"
    :on-submit="onSubmit"
    :has-reset="true"
    :submit-prop="submitProp"
    :components-maps="maps"
  />
<ElButton @click="handleSubmit">外部提交</ElButton>
</template>

<script setup>
import { defineComponent, reactive, ref } from 'vue'
const formRef = ref()
const submitProp = ref({
  submitText: 'submit',
})
const maps = {}
const request = (params) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          value: 'Option1',
          label: 'Option1',
        },
        {
          value: 'Option2',
          label: params ? params.select3 : 'Option2',
        },
      ])
    }, 3000)
  })
}
const list = ref([
  {
    prop: 'input1',
    type: 'input',
    formItemProps: {
      label: 'input1',
      // labelWidth: 'auto',
    },
    componentProps: {
      showPassword: true,
    },
    colProps: {
      span: 12,
    },
  },
  {
    prop: 'input2',
    type: 'input',
    formItemProps: {
      label: 'input2',
    },
    componentProps: {
      showPassword: true,
    },
    condFunc: () => {
      return modelForm.value.input1.length > 5
    },
    colProps: {
      span: 12,
    },
  },
  {
    prop: 'input3',
    type: 'input',
    formItemProps: {
      label: 'input3',
      labelFunc: () => {
        return `input1关联:${modelForm.value.input1}`
      },
      advReadonly: true,
    },
    componentProps: {},
    colProps: {
      span: 3,
    },
  },
  {
    prop: 'select1',
    type: 'select',
    formItemProps: {
      label: 'select1',
      advReadonly: true,
    },
    componentProps: {
      options: [
        {
          value: 'Option1',
          label: 'Option1',
        },
        {
          value: 'Option2',
          label: 'Option2',
        },
      ],
    },
  },
  {
    prop: 'select2',
    type: 'select',
    formItemProps: {
      label: 'select2',
      dependenciesRules: () => {
        if (modelForm.value.input1) {
          return {
            required: true,
            message: 'Please select Activity zone',
            trigger: 'change',
          }
        } else {
          return {}
        }
      },
    },
    componentProps: {
      request,
    },
    dependencies: ['select3', 'form1/input1'],
  },
  {
    prop: 'select3',
    type: 'select',
    formItemProps: {
      label: 'select3',
    },
    componentProps: {
      groups: [
        {
          label: 'Popular cities',
          options: [
            {
              value: 'Shanghai',
              label: 'Shanghai',
            },
            {
              value: 'Beijing',
              label: 'Beijing',
            },
          ],
        },
        {
          label: 'City name',
          options: [
            {
              value: 'Chengdu',
              label: 'Chengdu',
            },
            {
              value: 'Shenzhen',
              label: 'Shenzhen',
            },
          ],
        },
      ],
    },
  },
  {
    prop: 'radio1',
    type: 'radio',
    formItemProps: {
      label: 'radio1',
    },
    componentProps: {
      options: [
        {
          label: 'Shanghai',
        },
        {
          label: 'Beijing',
        },
      ],
    },
  },
  {
    prop: 'radio2',
    type: 'radio',
    formItemProps: {
      label: 'radio2',
    },
    componentProps: {
      request: (params) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                label: 'Shanghai',
              },
              {
                label: 'Beijing',
              },
            ])
          }, 3000)
        })
      },
    },
  },
  {
    prop: 'checkbox1',
    type: 'checkbox',
    formItemProps: {
      label: 'checkbox1',
    },
    componentProps: {
      request: (params) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                label: 'Shanghai',
              },
              {
                label: 'Beijing',
              },
            ])
          }, 3000)
        })
      },
    },
  },
  {
    prop: 'checkbox2',
    type: 'checkbox',
    formItemProps: {
      label: 'checkbox2',
    },
    componentProps: {
      options: [
        {
          label: 'Shanghai',
        },
        {
          label: 'Beijing',
        },
      ],
    },
  },
  {
    prop: 'number1',
    type: 'number',
    formItemProps: {
      label: 'number1',
    },
    componentProps: {},
  },
  {
    prop: 'colorPicker1',
    type: 'colorPicker',
    formItemProps: {
      label: 'colorPicker1',
    },
    componentProps: {},
  },
  {
    prop: 'colorPicker2',
    type: 'colorPicker',
    formItemProps: {
      label: 'colorPicker2',
      advReadonly: true,
    },
    componentProps: {},
  },
  {
    prop: 'treeSelect1',
    type: 'treeSelect',
    formItemProps: {
      label: 'treeSelect1',
    },
    componentProps: {
      data: [
        {
          value: '1',
          label: 'Level one 1',
          children: [
            {
              value: '1-1',
              label: 'Level two 1-1',
              children: [
                {
                  value: '1-1-1',
                  label: 'Level three 1-1-1',
                },
              ],
            },
          ],
        },
        {
          value: '2',
          label: 'Level one 2',
          children: [
            {
              value: '2-1',
              label: 'Level two 2-1',
              children: [
                {
                  value: '2-1-1',
                  label: 'Level three 2-1-1',
                },
              ],
            },
            {
              value: '2-2',
              label: 'Level two 2-2',
              children: [
                {
                  value: '2-2-1',
                  label: 'Level three 2-2-1',
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    prop: 'rate1',
    type: 'rate',
    formItemProps: {
      label: 'rate1',
    },
    componentProps: {},
  },
  {
    prop: 'rate2',
    type: 'rate',
    formItemProps: {
      label: 'rate2',
      advReadonly: true,
    },
    componentProps: {
      showScore: true,
      scoreTemplate: '{value} points',
      texts: ['oops', 'disappointed', 'normal', 'good', 'great'],
    },
  },
  {
    prop: 'switch2',
    type: 'switch',
    formItemProps: {
      label: 'switch2',
    },
    componentProps: {
      activeText: 'switchtrue',
      inactiveText: 'switchfalse',
    },
  },
  {
    prop: 'switch1',
    type: 'switch',
    formItemProps: {
      label: 'switch1',
    },
    componentProps: {
      activeText: '是',
      inactiveText: '否',
    },
  },
  {
    prop: 'input5',
    type: 'test1',
    formItemProps: {
      label: 'test1-custom',
    },
    componentProps: {
      showPassword: true,
    },
  },
  {
    prop: 'timePicker1',
    type: 'timePicker',
    formItemProps: {
      label: 'timePicker1',
    },
    componentProps: {
      isRange: true,
    },
  },
  {
    prop: 'timePicker2',
    type: 'timePicker',
    formItemProps: {
      label: 'timePicker2',
      advReadonly: true,
    },
    componentProps: {},
  },
  {
    prop: 'datePicker2',
    type: 'datePicker',
    formItemProps: {
      label: 'datePicker2',
    },
    componentProps: {
      type: 'month',
    },
  },
  {
    type: 'form',
    prop: 'form1',
    formProps: {
      rules: {
        input1: [
          {
            required: true,
            message: 'Please input input1',
            trigger: 'blur',
          },
        ],
      },
      label: '测试form1',
    },
    fields: [
      {
        prop: 'input1',
        type: 'input',
        colProps: {
          span: 6,
        },
        formItemProps: {
          label: 'form1-input1',
          labelWidth: 'auto',
        },
        componentProps: {
          showPassword: true,
        },
      },
      {
        prop: 'input2',
        type: 'input',
        formItemProps: {
          label: 'form1-input2',
          advReadonly: true,
          labelWidth: 'auto',
        },
        colProps: {
          span: 6,
        },
        componentProps: {
          showPassword: true,
        },
      },
      {
        prop: 'input3',
        type: 'input',
        formItemProps: {
          label: 'form1-input3',
        },
        componentProps: {
          showPassword: true,
        },
        condFunc: () => {
          return modelForm.value.input1.length > 5
        },
      },
      {
        prop: 'timePicker1',
        type: 'timePicker',
        formItemProps: {
          label: 'timePicker1',
        },
        componentProps: {
          isRange: true,
        },
      },
    ],
    hasReset: true,
  },
  {
    type: 'formList',
    prop: 'formList1',
    formProps: {
      rules: {
        input1: [
          {
            required: true,
            message: 'Please input input1',
            trigger: 'blur',
          },
        ],
      },
      hasReset: true,
      label: 'formlist',
    },
    fields: [
      {
        type: 'form',
        prop: 'form1',
        formProps: {
          rules: {
            input1: [
              {
                required: true,
                message: 'Please input input1',
                trigger: 'blur',
              },
            ],
          },
          label: 'formlist-form',
          hasReset: true,
        },
        fields: [
          {
            prop: 'input1',
            type: 'input',
            colProps: {
              span: 12,
            },
            formItemProps: {
              label: 'form1-input1',
              labelWidth: 'auto',
            },
            componentProps: {
              showPassword: true,
            },
          },
          {
            prop: 'input2',
            type: 'input',
            colProps: {
              span: 12,
            },
            formItemProps: {
              label: 'form1-input2',
              labelWidth: 'auto',
            },
            componentProps: {
              showPassword: true,
            },
          },
        ],
      },
    ],
  },
])
const modelForm = ref({
  input1: 'input1',
  input2: '',
  input3: 'input3',
  radio1: '',
  radio2: '',
  select1: 'Option1',
  select2: 'Option1',
  number: null,
  switch1: true,
  switch2: 'switchtrue',
  timePicker1: null,
  timePicker2: new Date(),
  datePicker2: null,
  checkbox1: [],
  checkbox2: [],
  rate1: null,
  rate2: 3,
  colorPicker1: null,
  colorPicker2: '#A30F0F',
  treeSelect1: null,
  form1: {
    input1: 'form1input1',
    input2: '',
    input3: 'form1input3',
    timePicker1: null,
  },
  formList1: [
    {
      input1: '',
      input2: '',
    },
  ],
})
const rules = reactive({
  input1: [
    {
      required: true,
      message: 'Please input Activity name',
      trigger: 'blur',
    },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
  radio21: [
    { required: true, message: 'Please input radio2', trigger: 'change' },
  ],
})
const handleSubmit = async () => {
  if (formRef.value) {
    const value = await formRef.value.validate()
    if (value === true) {
      alert('外部提交成功')
    }
  }
}

const onSubmit = () => {
  return (
    new Promise((resolve) => {
      setTimeout(() => {
        modelForm.value.select1 = 'Option2'
        alert('内部提交成功')
        resolve(true)
      }, 600)
    })
  )
}
</script>
```

:::

## 其他

### 关于样式

#### 
如果项目是自动导入 element-plus，需要手动引入相关样式

#### 普通使用

```javascript
import '@advanced-elements/form/es/index.css'
```

#### 配合 namespace 使用

```javascript
import '@advanced-elements/form/style/index.scss'
```
