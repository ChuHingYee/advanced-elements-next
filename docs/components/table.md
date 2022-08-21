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

:::demo

```vue
<template>
  <adv-table :data="data" style="width: 100%">
    <el-table-column prop="name" label="姓名"/>
    <el-table-column label="格式化" width="120" align="center">
      <template #default="scope">
        <span>{{ scope.row.name }}test</span>
      </template>
    </el-table-column>
  </adv-table>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Demo1',
  setup() {
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
    return { data }
  },
})
</script>
```

:::

### 通过 Headers 控制表头

:::demo

```vue
<template>
  <adv-table :data="data" :headers="headers" style="width: 100%"/>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Demo2',
  setup() {
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
    return { data, headers }
  },
})
</script>
```

:::

## 数据来源为请求方法

### 用于自动请求

:::demo

```vue
<template>
  <adv-table :source="request" style="width: 100%">
    <el-table-column prop="name" label="姓名"/>
    <el-table-column label="格式化" width="120" align="center">
      <template #default="scope">
        <span>{{ scope.row.name }}test</span>
      </template>
    </el-table-column>
  </adv-table>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Demo3',
  setup() {
    const request = function () {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: [
              {
                name: (Math.random() * 10).toFixed(3),
                id: Date.now(),
              },
              {
                name: (Math.random() * 10).toFixed(3),
                id: Date.now(),
              },
              {
                name: (Math.random() * 10).toFixed(3),
                id: Date.now(),
              },
            ],
            total: 3,
          })
        }, 500)
      })
    }
    return { request }
  },
})
</script>
```

:::

### 用于手动请求

:::demo

```vue
<template>
  <adv-table ref="table" :source="request" :auto="false">
    <el-table-column prop="name" label="姓名" width="180"/>
    <el-table-column prop="id" label="id证明"/>
    <template #footer>
      <el-button @click="refresh">获取数据</el-button>
    </template>
  </adv-table>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Demo4',
  setup() {
    const table = ref()
    const request = function () {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: [
              {
                name: (Math.random() * 10).toFixed(3),
                id: Date.now(),
              },
              {
                name: (Math.random() * 10).toFixed(3),
                id: Date.now(),
              },
              {
                name: (Math.random() * 10).toFixed(3),
                id: Date.now(),
              },
            ],
            total: 3,
          })
        }, 500)
      })
    }
    function refresh() {
      table.value.refresh(true)
    }
    return { table, request, refresh }
  },
})
</script>
```

:::

### 用于手动触发加载更多

:::demo

```vue
<template>
  <adv-table :source="request" :is-manual="true">
    <el-table-column prop="name" label="姓名" width="180"/>
    <el-table-column prop="id" label="id证明"/>
  </adv-table>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Demo5',
  setup() {
    const table = ref()
    const request = function () {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: [
              {
                name: (Math.random() * 10).toFixed(3),
                id: Date.now(),
              },
              {
                name: (Math.random() * 10).toFixed(3),
                id: Date.now(),
              },
              {
                name: (Math.random() * 10).toFixed(3),
                id: Date.now(),
              },
            ],
            total: 3,
          })
        }, 500)
      })
    }
    return { request }
  },
})
</script>
```

:::

### 用于轮询更新数据

:::demo

```vue
<template>
  <adv-table :source="request" :has-polling-btn="true" :has-refresh-btn="true">
    <el-table-column prop="name" label="姓名" width="180"/>
    <el-table-column prop="id" label="id证明"/>
  </adv-table>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Demo5',
  setup() {
    const table = ref()
    const request = function () {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: [
              {
                name: (Math.random() * 10).toFixed(3),
                id: Date.now(),
              },
              {
                name: (Math.random() * 10).toFixed(3),
                id: Date.now(),
              },
              {
                name: (Math.random() * 10).toFixed(3),
                id: Date.now(),
              },
            ],
            total: 3,
          })
        }, 500)
      })
    }
    return { request }
  },
})
</script>
```

:::

## 其他

### 关于样式

#### 如果项目是自动导入 element-plus，需要手动引入相关样式

```javascript
// element-plus样式
import 'element-plus/es/components/icon/style/css'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/popover/style/css'
import 'element-plus/es/components/checkbox/style/css'
import 'element-plus/es/components/tooltip/style/css'
import 'element-plus/es/components/table/style/css'
import 'element-plus/es/components/pagination/style/css'
import 'element-plus/es/components/loading/style/css'
```
#### 普通使用

```javascript
import '@advanced-elements/table/es/index.css'
```

#### 配合namespace使用

```javascript
import '@advanced-elements/table/style/index.scss'
```