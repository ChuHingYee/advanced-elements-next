<template>
  <div class="advtable">
    <el-table
      v-loading="localLoading"
      :element-loading-spinner="loadingSvg"
      element-loading-svg-view-box="-10, -10, 50, 50"
      class="advtable-main"
      v-bind="computedTableProps"
    >
      <el-table-column
        v-for="header in headers"
        :key="header.prop"
        v-bind="header"
      >
        <template #default="{ row }">
          {{ header.format ? header.format(row) : row[header.prop] }}
        </template>
      </el-table-column>
      <slot></slot>
    </el-table>
    <div
      v-if="hasPage"
      ref="page"
      class="advtable-page"
      :class="computedPageClass"
    >
      <template v-if="isManual">
        <el-button
          v-if="localCurrentPage !== localTotalPage && localCurrentPage !== 0"
          :size="buttonSize"
          icon="el-icon-refresh-right"
          :loading="localLoading"
          @click="loadDataByManual"
          >加载更多</el-button
        >
        <div
          v-if="
            localCurrentPage === localTotalPage &&
            localCurrentPage !== 0 &&
            localData.length !== 0
          "
          class="table-manual__btn"
        >
          没有更多了
        </div>
      </template>
      <template v-else>
        <slot name="footer"></slot>
        <el-pagination
          ref="pagination"
          v-model:currentPage="localCurrentPage"
          :page-size="localPageSize"
          :page-sizes="pageSizes"
          :layout="localPageLayout"
          :total="localTotal"
          @update:current-page="handleCurrentPageChange"
          @update:page-size="handlePageSizeChange"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import {
  ElTable,
  ElTableColumn,
  ElPagination,
  ElButton,
  useSize,
} from 'element-plus'
import tableProps from 'element-plus/lib/components/table/src/table/defaults'
import type { TableProps } from 'element-plus/lib/components/table/src/table/defaults'
import { advProps } from './defaults'
import { formatData } from './utils'
import {
  defineComponent,
  ref,
  computed,
  watch,
  onMounted,
  nextTick,
  getCurrentInstance,
} from 'vue'
import type { Router, RouteLocationNormalizedLoaded } from 'vue-router'
type TablePropsKeys = keyof typeof tableProps

export default defineComponent({
  name: 'AdvTable',
  components: {
    ElTable,
    ElTableColumn,
    ElPagination,
    ElButton,
  },
  inheritAttrs: false,
  props: advProps,
  setup(props, ctx) {
    const instance = getCurrentInstance()!
    const router = instance.appContext.config.globalProperties.$router as Router
    const route = instance.appContext.config.globalProperties
      .$route as RouteLocationNormalizedLoaded
    const pagination = ref()
    const buttonSize = useSize()
    const defaultTableConfig = ref({
      stripe: true,
      border: true,
    })
    const localCurrentPage = ref(1)
    const localTotalPage = ref(0)
    const localPageLayout = ref('total, sizes, prev, pager, next, jumper')
    const localPageSize = ref(10)
    const localPageSizes = ref([10, 20, 30])
    const localTotal = ref(1)
    const localData = ref<any[]>([])
    const localLoading = ref(false)
    const isSticky = ref(false)
    const loadingSvg = ref(`
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `)
    const computedPageClass = computed(() => {
      const _sticky = isSticky.value ? 'advtable-page__sticky' : ''
      const _manual = props.isManual ? 'table-manual' : 'true'
      return `${_sticky} ${_manual}`
    })
    const computedTableProps = computed<TableProps<any>>(() => {
      const _props = {
        ...defaultTableConfig.value,
        data: hasSource.value ? localData.value : props.data,
      }
      const tablePropsKeys = Object.keys(tableProps)
      Object.keys(props).forEach((k) => {
        const tableKey = tablePropsKeys.find((key) => {
          return key === k
        })
        if (tableKey && tableKey !== 'data') {
          _props[tableKey as TablePropsKeys] = props[tableKey as TablePropsKeys]
        }
      })
      return _props as TableProps<any>
    })
    const hasSource = computed(() => {
      return !!props.source
    })
    const pageSizes = computed(() => {
      return props.pageSizes || localPageSizes.value
    })
    watch(
      () => {
        return props.clientHeight
      },
      () => {
        checkIsSticky()
      },
      {
        immediate: true,
      }
    )
    const request = function (): Promise<void> {
      return new Promise((resolve) => {
        if (props.source) {
          setLoading(true)
          const querys = {
            page: localCurrentPage.value,
            size: localPageSize.value,
          }
          props
            .source(querys)
            .then((res) => {
              if (props.formatMaps) {
                res = formatData(res, props.formatMaps)
              }
              localTotal.value = res.total
              localTotalPage.value = res.totalPage
              if (props.isManual) {
                localData.value = localData.value.concat(res.data)
              } else {
                localData.value = res.data
              }
              resolve()
            })
            .finally(() => {
              setLoading(false)
            })
        } else {
          resolve()
        }
      })
    }
    const loadDataByManual = function () {
      if (
        localCurrentPage.value !== localTotalPage.value &&
        localTotalPage.value !== 0
      ) {
        handleCurrentPageChange(localCurrentPage.value + 1)
      } else {
        handleCurrentPageChange(localCurrentPage.value)
      }
    }
    function handleCurrentPageChange(val: number) {
      if (props.isRecord && !props.isManual) {
        setPageLog(val, localPageSize.value)
      }
      request()
      ctx.emit('change-page', {
        page: val,
        size: localPageSize.value,
      })
    }
    function handlePageSizeChange(val: number) {
      localPageSize.value = val
      localCurrentPage.value = 1
      if (props.isRecord && !props.isManual) {
        setPageLog(1, localPageSize.value)
      }
      request()
      ctx.emit('change-page', {
        page: 1,
        size: val,
      })
    }
    function setLoading(flag: boolean) {
      localLoading.value = flag
    }
    function setPageLog(page: number, count: number) {
      if (router) {
        const { path, query } = route
        router.replace({
          path,
          query: {
            ...query,
            p: page,
            s: count,
          },
        })
      }
    }
    function refresh(flag: boolean) {
      if (hasSource.value) {
        localData.value = []
        if (flag) {
          localCurrentPage.value = 1
          if (props.isRecord) {
            setPageLog(1, localPageSize.value)
          }
        } else {
          if (props.isRecord && route) {
            const { p, s } = route.query
            if (!p) {
              localCurrentPage.value = 1
            }
            if (!s) {
              localPageSize.value = 10
            }
          }
        }
        request()
      }
    }
    function checkIsSticky() {
      nextTick(() => {
        if (pagination.value && props.clientHeight && props.openSticky) {
          const rect = pagination.value.$el.getBoundingClientRect()
          if (rect.top > props.clientHeight - 45) {
            isSticky.value = true
          }
        }
      })
    }
    onMounted(() => {
      if (props.pageSize) {
        localPageSize.value = props.pageSize
      }
      if (props.isRecord && !props.isManual && route) {
        const { p, s } = route.query
        if (p) {
          localCurrentPage.value = Number(p as string)
        }
        if (s) {
          localPageSize.value = Number(s as string)
        }
      }
      if (props.autoRequest) {
        request()
      }
    })
    return {
      pagination,
      buttonSize,
      hasSource,
      defaultTableConfig,
      loadingSvg,
      request,
      localCurrentPage,
      localPageLayout,
      localTotal,
      localTotalPage,
      localPageSize,
      pageSizes,
      localData,
      localLoading,
      isSticky,
      computedPageClass,
      computedTableProps,
      setLoading,
      setPageLog,
      loadDataByManual,
      handleCurrentPageChange,
      handlePageSizeChange,
      refresh,
      checkIsSticky,
    }
  },
})
</script>

<style lang="scss">
.advtable {
  position: relative;

  &-main {
    margin-bottom: 10px;
  }

  &-page {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    background: #fff;
    &__sticky {
      position: sticky;
      bottom: 0;
      z-index: 8;
    }
  }
  &-manual {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    &__btn {
      width: 220px;
      height: 32px;
      color: #606266;
      font-size: 12px;
      line-height: 32px;
      text-align: center;
      background: #fff;
      border: 1px solid #dcdfe6;
      border-radius: 3px;
    }
    ::v-deep .el-button {
      width: 220px;
    }
  }
}
</style>
