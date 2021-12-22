# adv-table 表格

封装于 el-table 和 el-pagination 组件，在不破坏其原有功能基础上,解决表格样板代码过多问题。

## 渲染表头方式

### 普通渲染表头

:::demo

```vue
<template>
  <adv-table :data="data" style="width: 100%">
    <el-table-column prop="name" label="姓名"></el-table-column>
    <el-table-column label="格式化" width="120" align="center">
      <template #default="scope">
        <span>{{ scope.row.name }}test</span>
      </template>
    </el-table-column>
  </adv-table>
</template>

<script>
import { ref, defineComponent } from 'vue'

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
  <adv-table :data="data" :headers="headers" style="width: 100%"></adv-table>
</template>

<script>
import { ref, defineComponent } from 'vue'

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
    <el-table-column prop="name" label="姓名"></el-table-column>
    <el-table-column label="格式化" width="120" align="center">
      <template #default="scope">
        <span>{{ scope.row.name }}test</span>
      </template>
    </el-table-column>
  </adv-table>
</template>

<script>
import { ref, defineComponent } from 'vue'

export default defineComponent({
  name: 'Demo3',
  setup() {
    const request = function () {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: [
              {
                id: '1',
                name: 1,
              },
              {
                id: '2',
                name: 2,
              },
              {
                id: '1',
                name: 1,
              },
            ],
            size: 2,
            totalPage: 2,
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
  <adv-table :source="request" ref="table" :auto="false">
    <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
    <el-table-column prop="address" label="地址"> </el-table-column>
    <template #footer>
      <el-button @click="refresh">获取数据</el-button>
    </template>
  </adv-table>
</template>

<script>
import { ref, defineComponent } from 'vue'

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
                id: '1',
                name: 1,
              },
              {
                id: '2',
                name: 2,
              },
              {
                id: '1',
                name: 1,
              },
            ],
            size: 2,
            totalPage: 2,
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
  <adv-table :source="request" :isManual="true">
    <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
    <el-table-column prop="address" label="地址"> </el-table-column>
  </adv-table>
</template>

<script>
import { ref, defineComponent } from 'vue'

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
                id: '1',
                name: 1,
              },
              {
                id: '2',
                name: 2,
              },
              {
                id: '1',
                name: 1,
              },
            ],
            size: 2,
            totalPage: 2,
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
