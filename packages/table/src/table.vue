<template>
  <div v-if="isInit" class="advtable">
    <div v-if="hasHeader" class="advtable-header">
      <div class="advtable-header__left">
        <slot name="header-left"></slot>
      </div>
      <div class="advtable-header__right">
        <slot name="header-right"></slot>
        <polling-btn
          v-if="hasPollingBtn && hasSource && !isManual"
          v-model:isPolling="isPolling"
          :options="pollingOptions"
        ></polling-btn>
        <el-icon v-if="hasRefreshBtn" :size="18" @click="refresh(false)">
          <icon-refresh-right></icon-refresh-right>
        </el-icon>
        <column-setting
          v-if="headers.length > 0 && hasColumnSetting"
          v-model:headers="localHeader"
        ></column-setting>
      </div>
    </div>
    <el-table v-bind="customTableProps" ref="table" class="advtable-main">
      <template v-for="header in localHeader" :key="header.prop">
        <el-table-column
          v-if="header.isVisible"
          :key="header.prop"
          v-bind="header"
        >
          <template #default="{ row }">{{
            header.format ? header.format(row) : row[header.prop]
          }}</template>
        </el-table-column>
      </template>
      <slot></slot>
    </el-table>
    <div
      v-if="hasPage"
      ref="page"
      class="advtable-page"
      :class="paginationClass"
    >
      <template v-if="isManual">
        <el-button
          v-if="hasMore"
          :size="elementSize"
          :loading="localLoading"
          @click="loadDataByManual"
          >加载更多</el-button
        >
        <span v-else-if="!hasMore && !localLoading">没有更多了</span>
      </template>
      <template v-else>
        <slot name="footer"></slot>
        <el-pagination
          ref="pagination"
          v-model:currentPage="localCurrentPage"
          :small="elementSize === 'small'"
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
  defineComponent,
  ref,
  computed,
  watch,
  onMounted,
  nextTick,
  provide,
  getCurrentInstance,
  useSlots,
} from 'vue'
import {
  ElTable,
  ElTableColumn,
  ElPagination,
  ElButton,
  ElLoading,
  ElIcon,
  useSize,
} from 'element-plus'
import { RefreshRight as IconRefreshRight } from '@element-plus/icons-vue'
import ColumnSetting from './columnSetting.vue'
import PollingBtn from './pollingBtn.vue'
import 'element-plus/es/components/table/style/css'
import 'element-plus/es/components/pagination/style/css'
import 'element-plus/es/components/button/style/css'
import tableProps from 'element-plus/lib/components/table/src/table/defaults'
import { advProps } from './defaults'
import { formatData } from './utils'
import type { LocalHeader } from './defaults'
import type { LoadingInstance } from 'element-plus/lib/components/loading/src/loading'
import type { TableProps } from 'element-plus/lib/components/table/src/table/defaults'
import type { Router, RouteLocationNormalizedLoaded } from 'vue-router'
type TablePropsKeys = keyof typeof tableProps

export default defineComponent({
  name: 'AdvTable',
  components: {
    ElTable,
    ElTableColumn,
    ElPagination,
    ElButton,
    ElIcon,
    IconRefreshRight,
    ColumnSetting,
    PollingBtn,
  },
  inheritAttrs: false,
  props: advProps,
  setup(props, ctx) {
    let loadingInstance: LoadingInstance
    const slots = useSlots()
    const isInit = ref(false)
    const table = ref()
    const instance = getCurrentInstance()!
    const router = instance.appContext.config.globalProperties.$router as Router
    const route = instance.appContext.config.globalProperties
      .$route as RouteLocationNormalizedLoaded
    const pagination = ref()
    const elementSize = useSize()
    const defaultTableConfig = ref({
      stripe: true,
      border: true,
    })
    const localCurrentPage = ref(1)
    const localPageLayout = ref('total, sizes, prev, pager, next, jumper')
    const localPageSize = ref(10)
    const localPageSizes = ref([10, 20, 30])
    const localTotal = ref(1)
    const localData = ref<any[]>([])
    const localLoading = ref(false)
    const isSticky = ref(false)
    const localHeader = ref<LocalHeader[]>([])
    const isPolling = ref(false)
    const paginationClass = computed(() => {
      const _sticky = isSticky.value ? 'advtable-page__sticky' : ''
      const _manual = props.isManual ? 'advtable-page__manual' : ''
      return `${_sticky} ${_manual}`
    })
    const customTableProps = computed<TableProps<any>>(() => {
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
    const hasMore = computed(() => {
      const current = localPageSize.value * localCurrentPage.value
      return current < localTotal.value && localCurrentPage.value !== 0
    })
    const hasHeader = computed(() => {
      return (
        slots['header-left'] ||
        slots['header-right'] ||
        props.hasColumnSetting ||
        props.hasRefreshBtn ||
        props.hasPollingBtn
      )
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
    const request = function (): Promise<any[]> {
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
              const formatResponse = formatData(res, props.formatMaps)
              localTotal.value = formatResponse.total
              if (props.isManual) {
                localData.value = localData.value.concat(formatResponse.data)
              } else {
                localData.value = formatResponse.data
              }
              resolve(localData.value)
            })
            .finally(() => {
              setLoading(false)
            })
        } else {
          resolve([])
        }
      })
    }
    const loadDataByManual = function () {
      if (hasMore.value) {
        localCurrentPage.value = localCurrentPage.value + 1
        handleCurrentPageChange(localCurrentPage.value)
      }
    }
    function handleCurrentPageChange(val: number) {
      if (props.isRecord && !props.isManual) {
        setPageLog(val, localPageSize.value)
      }
      if (props.hasPollingBtn) {
        // 停止轮询
        isPolling.value = false
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
      if (props.hasPollingBtn) {
        // 停止轮询
        isPolling.value = false
      }
      request()
      ctx.emit('change-page', {
        page: 1,
        size: val,
      })
    }
    function setLoading(flag: boolean) {
      localLoading.value = flag
      if (isPolling.value) {
        loadingInstance && loadingInstance.close()
        return
      }
      if (flag) {
        loadingInstance = ElLoading.service({
          target: table.value.$el,
          fullscreen: false,
        })
      } else {
        loadingInstance.close()
      }
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
      return new Promise((resolve, reject) => {
        if (localLoading.value || !hasSource.value) {
          resolve(true)
        }
        if (flag || props.isManual) {
          localCurrentPage.value = 1
          if (props.isRecord && !props.isManual) {
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
          .then(() => {
            resolve(true)
          })
          .catch((e) => {
            reject(e)
          })
      })
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
      if (props.headers && props.headers.length > 0) {
        localHeader.value = props.headers.map((header) => {
          return {
            isVisible: true,
            ...header,
          }
        })
      }
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
      isInit.value = true
      if (props.autoRequest) {
        nextTick(() => {
          request()
        })
      }
    })
    provide('advTable', {
      refresh,
      localLoading,
    })
    return {
      isInit,
      table,
      pagination,
      elementSize,
      hasSource,
      defaultTableConfig,
      localCurrentPage,
      localPageLayout,
      localTotal,
      localPageSize,
      localHeader,
      pageSizes,
      localData,
      localLoading,
      isSticky,
      isPolling,
      paginationClass,
      customTableProps,
      hasMore,
      hasHeader,
      request,
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

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    &__left,
    &__right {
      display: flex;
      align-items: center;
      .right {
        &-icon {
          margin-left: 12px;
          color: var(--el-button-text-color);
          cursor: pointer;
        }
      }
    }
    &__left {
      justify-content: flex-start;
    }
    &__right {
      justify-content: flex-end;
    }
  }

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
    &__manual {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      color: var(--el-color-info);
      font-size: var(--el-font-size-base);
    }
  }
}
</style>
