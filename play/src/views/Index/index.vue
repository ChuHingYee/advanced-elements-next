<script setup lang="ts">
import AdvTable from '@advanced-elements/table'
import type { FormatMaps } from '@advanced-elements/table'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
const router = useRouter()
console.log(router)
const table = ref()
const headers = ref([
  {
    label: '姓名',
    prop: 'name',
  },
  {
    label: '地址',
    prop: 'address',
  },
  {
    label: '格式化',
    prop: 'formatName',
    width: 120,
    align: 'center',
    format(val: any) {
      return `${val.name}test`
    },
  },
])
const maps: FormatMaps = {
  d: 'data',
  s: 'size',
  tp: 'totalPage',
  t: 'total',
}
const request: any = function () {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        d: [
          {
            id: '1',
            name: 1,
          },
          {
            id: '2',
            name: 2,
          },
          {
            id: '3',
            name: 1,
          },
          {
            id: '4',
            name: 2,
          },
        ],
        s: 2,
        tp: 2,
        t: 4,
      })
    }, 500)
  })
}
const request1: any = function (querys: any) {
  console.log(querys)
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
        ],
        size: 2,
        totalPage: 2,
        total: 4,
      })
    }, 500)
  })
}
const refresh = function () {
  table.value.refresh(true)
}
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
</script>

<template>
  <adv-table
    ref="table"
    :format-maps="maps"
    :source="request"
    :headers="headers"
    :is-record="false"
    :client-height="200"
  >
    <template #footer>
      <el-button @click="refresh">获取数据</el-button>
    </template>
  </adv-table>
  <adv-table
    :source="request1"
    :headers="headers"
    :is-record="true"
    :client-height="200"
    :page-size="2"
    :page-sizes="[2, 3]"
  >
    <el-table-column prop="name" label="姓名" width="180" />
    <el-table-column prop="id" label="id" width="180" />
  </adv-table>
</template>

<style></style>
