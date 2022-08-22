# adv-table 表格

封装于 el-table 和 el-pagination 组件，在不破坏其原有功能基础上,解决表格样板代码过多问题。

## 安装

```shell
# 选择一个你喜欢的包管理器

# NPM
$ npm install @advanced-elements/table@'>=2' --save
# Yarn
$ yarn add @advanced-elements/table@'>=2'
# pnpm
$ pnpm add @advanced-elements/table@'>=2'
```

## 渲染表头方式

### 普通渲染表头

<script setup>
  import { ref } from 'vue'
  const data = ref([
    {
      id: '1',
      name: 1,
    },
    {
      id: '2',
      name: 2,
    },
  ])
  const headers = ref([
    {
      label: '姓名',
      prop: 'name',
    },
    {
      label: '格式化',
      prop: 'formatName',
      width: 120,
      align: 'center',
      format(val) {
        return `${val.name}test`
      },
    },
  ])
  const request = function () {
    return new Promise((resolve) => {
      const initials = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
      const total = Math.ceil(Math.random() * 500)
      const data = Array.from({ length: 10}).map((_, idx) => ({
        name: `Option ${idx + 1}`,
        id: `${initials[idx % 10]}${idx}`,
      }))
      setTimeout(() => {
        resolve({
          data,
          total,
        })
      }, 500)
    })
  }

  const manual = ref()
  const refresh = () => {
    manual.value.refresh(true)
  }
</script>

<AdvTable :data="data" style="width: 100%">
  <ElTableColumn prop="name" label="姓名"/>
  <ElTableColumn label="格式化" width="120" align="center">
    <template #default="scope">
      <span>{{ scope.row.name }}test</span>
    </template>
  </ElTableColumn>
</AdvTable>

::: details 查看代码

```vue
<template>
  <AdvTable :data="data" style="width: 100%">
    <ElTableColumn prop="name" label="姓名"/>
    <ElTableColumn label="格式化" width="120" align="center">
      <template #default="scope">
        <span>{{ scope.row.name }}test</span>
      </template>
    </ElTableColumn>
  </AdvTable>
</template>

<script setup>
import { AdvTable } from '@advanced-elements/table'

const data = ref([
  {
    id: '1',
    name: 1,
  },
  {
    id: '2',
    name: 2,
  },
])
</script>
```

:::

### 通过 Headers 控制表头

<AdvTable :data="data" :headers="headers" style="width: 100%"/>

::: details 查看代码

```vue
<template>
  <AdvTable :data="data" :headers="headers" style="width: 100%"/>
</template>

<script setup>
import { AdvTable } from '@advanced-elements/table'

const data = ref([
  {
    id: '1',
    name: 1,
  },
  {
    id: '2',
    name: 2,
  },
])
const headers = ref([
  {
    label: '姓名',
    prop: 'name',
  },
  {
    label: '格式化',
    prop: 'formatName',
    width: 120,
    align: 'center',
    format(val) {
      return `${val.name}test`
    },
  },
])
</script>
```

:::

## 数据来源为请求方法

### 用于自动请求
<AdvTable :source="request" style="width: 100%">
  <ElTableColumn prop="name" label="姓名"/>
  <ElTableColumn label="格式化" width="120" align="center">
    <template #default="scope">
      <span>id:{{scope.row.id}}{{ scope.row.name }}</span>
    </template>
  </ElTableColumn>
</AdvTable>

::: details 查看代码

```vue
<template>
  <AdvTable :source="request" style="width: 100%">
    <ElTableColumn prop="name" label="姓名"/>
    <ElTableColumn label="格式化" width="120" align="center">
      <template #default="scope">
        <span>id:{{scope.row.id}}{{ scope.row.name }}</span>
      </template>
    </ElTableColumn>
  </AdvTable>
</template>

<script setup>
import { AdvTable } from '@advanced-elements/table'

const request = function () {
  return new Promise((resolve) => {
    const initials = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
    const total = Math.ceil(Math.random() * 500)
    const data = Array.from({ length: 10}).map((_, idx) => ({
      name: `Option ${idx + 1}`,
      id: `${initials[idx % 10]}${idx}`,
    }))
    setTimeout(() => {
      resolve({
        data,
        total,
      })
    }, 500)
    })
}
</script>
```

:::

### 用于手动请求
<AdvTable :source="request" style="width: 100%" ref="manual" :auto="false">
  <ElTableColumn prop="name" label="姓名"/>
  <ElTableColumn label="格式化" width="120" align="center">
    <template #default="scope">
      <span>id:{{scope.row.id}}{{ scope.row.name }}</span>
    </template>
  </ElTableColumn>
  <template #footer>
      <el-button @click="refresh">获取数据</el-button>
    </template>
</AdvTable>

::: details 查看代码

```vue
<template>
 <AdvTable ref="manual" :source="request" style="width: 100%" :auto="false">
  <ElTableColumn prop="name" label="姓名"/>
  <ElTableColumn label="格式化" width="120" align="center">
    <template #default="scope">
      <span>id:{{scope.row.id}}{{ scope.row.name }}</span>
    </template>
  </ElTableColumn>
  <template #footer>
      <el-button @click="refresh">获取数据</el-button>
    </template>
</AdvTable>
</template>

<script setup>
import { AdvTable } from '@advanced-elements/table'

const request = function () {
  return new Promise((resolve) => {
    const initials = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
    const total = Math.ceil(Math.random() * 500)
    const data = Array.from({ length: 10}).map((_, idx) => ({
      name: `Option ${idx + 1}`,
      id: `${initials[idx % 10]}${idx}`,
    }))
    setTimeout(() => {
      resolve({
        data,
        total,
      })
    }, 500)
    })
}
</script>
```

:::

### 用于手动触发加载更多
<AdvTable :source="request" :isManual="true">
  <ElTableColumn prop="name" label="姓名"/>
  <ElTableColumn label="格式化" width="120" align="center">
    <template #default="scope">
      <span>id:{{scope.row.id}}{{ scope.row.name }}</span>
    </template>
  </ElTableColumn>
</AdvTable>

::: details 查看代码

```vue
<template>
  <AdvTable :source="request" :is-manual="true">
    <ElTableColumn prop="name" label="姓名"/>
    <ElTableColumn label="格式化" width="120" align="center">
      <template #default="scope">
        <span>id:{{scope.row.id}}{{ scope.row.name }}</span>
      </template>
    </ElTableColumn>
  </AdvTable>
</template>

<script setup>
import { AdvTable } from '@advanced-elements/table'

const request = function () {
  return new Promise((resolve) => {
    const initials = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
    const total = Math.ceil(Math.random() * 500)
    const data = Array.from({ length: 10}).map((_, idx) => ({
      name: `Option ${idx + 1}`,
      id: `${initials[idx % 10]}${idx}`,
    }))
    setTimeout(() => {
      resolve({
        data,
        total,
      })
    }, 500)
    })
}
</script>
```

:::

### 用于轮询更新数据
<AdvTable :source="request" :has-polling-btn="true" :has-refresh-btn="true">
  <ElTableColumn prop="name" label="姓名"/>
  <ElTableColumn label="格式化" width="120" align="center">
    <template #default="scope">
      <span>id:{{scope.row.id}}{{ scope.row.name }}</span>
    </template>
  </ElTableColumn>
</AdvTable>

::: details 查看代码

```vue
<template>
  <AdvTable :source="request" :has-polling-btn="true" :has-refresh-btn="true">
    <ElTableColumn prop="name" label="姓名"/>
    <ElTableColumn label="格式化" width="120" align="center">
      <template #default="scope">
        <span>id:{{scope.row.id}}{{ scope.row.name }}</span>
      </template>
    </ElTableColumn>
  </AdvTable>
</template>

<script setup>
import { AdvTable } from '@advanced-elements/table'

const request = function () {
  return new Promise((resolve) => {
    const initials = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
    const total = Math.ceil(Math.random() * 500)
    const data = Array.from({ length: 10}).map((_, idx) => ({
      name: `Option ${idx + 1}`,
      id: `${initials[idx % 10]}${idx}`,
    }))
    setTimeout(() => {
      resolve({
        data,
        total,
      })
    }, 500)
    })
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
import '@advanced-elements/table/es/index.css'
```

#### 配合namespace使用

```javascript
import '@advanced-elements/table/style/index.scss'
```