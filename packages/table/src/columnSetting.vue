<template>
  <el-popover placement="bottom" trigger="click">
    <template #reference>
      <div>
        <el-tooltip content="表头选择" effect="light">
          <el-icon :size="18" class="right-icon">
            <icon-setting></icon-setting>
          </el-icon>
        </el-tooltip>
      </div>
    </template>
    <div class="advcard">
      <div class="advcard-header">
        <el-checkbox
          v-model="isChooseAll"
          :indeterminate="isIndeterminate"
          size="large"
          @change="handleHeaderChange($event, 'all')"
          >列展示</el-checkbox
        >
        <el-button
          size="large"
          type="text"
          class="advcard-header__reset"
          @click="handleHeaderChange('none')"
          >重置</el-button
        >
      </div>
      <div class="advcard-body">
        <div
          v-for="(header, index) in localHeaders"
          :key="header.prop"
          class="advcard-body__check"
        >
          <el-checkbox
            :model-value="header.isVisible"
            size="large"
            @change="handleHeaderChange($event, header)"
            >{{ header.label }}</el-checkbox
          >
          <div class="check-btns">
            <el-icon
              class="check-btns__icon"
              @click="handleChangeSort(index, 0)"
            >
              <icon-caret-top></icon-caret-top>
            </el-icon>
            <el-icon
              class="check-btns__icon"
              @click="handleChangeSort(index, 1)"
            >
              <icon-caret-bottom></icon-caret-bottom>
            </el-icon>
          </div>
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { ref, onMounted, nextTick } from 'vue'
import {
  ElIcon,
  ElButton,
  ElPopover,
  ElTooltip,
  ElCheckbox,
} from 'element-plus'
import {
  Setting as IconSetting,
  CaretTop as IconCaretTop,
  CaretBottom as IconCaretBottom,
} from '@element-plus/icons-vue'
import { useVModel } from '@vueuse/core'
import type { LocalHeader } from './defaults'
interface HeadersMap {
  [key: string]: LocalHeader
}
interface HeadersFormatMap {
  [key: string]: any
}
const props = defineProps({
  headers: {
    type: Array as PropType<LocalHeader[]>,
    default: () => [],
  },
})
const emits = defineEmits(['update:headers'])
const isChooseAll = ref(false)
const isIndeterminate = ref(false)
const originHeaders: string[] = []
const originHeadersMap: HeadersMap = {}
const originHeadersFormatMap: HeadersFormatMap = {}

const localHeaders = useVModel(props, 'headers', emits)
const handleHeaderChange = (
  val: boolean | 'none',
  row?: LocalHeader | 'all'
) => {
  let _count = 0
  if (val === 'none') {
    localHeaders.value = originHeaders.map((key) => {
      const _header = {
        ...JSON.parse(JSON.stringify(originHeadersMap[key])),
      }
      if (originHeadersFormatMap[key]) {
        _header.format = originHeadersFormatMap[key]
      }
      return _header
    })
  }
  nextTick(() => {
    const _localHeaders = localHeaders.value.map((header) => {
      if (val !== 'none') {
        if (row === 'all') {
          header.isVisible = val
        } else {
          if (header.prop === row?.prop) {
            header.isVisible = val
          }
        }
      }
      if (header.isVisible) {
        _count++
      }
      return header
    })
    isIndeterminate.value = _count !== localHeaders.value.length && _count > 0
    isChooseAll.value = _count === localHeaders.value.length
    if (val !== 'none') {
      localHeaders.value = _localHeaders
    }
  })
}
const handleChangeSort = (index: number, type: 0 | 1) => {
  if (type === 0) {
    if (index === 0) {
      localHeaders.value = changeHeadersSort(
        index,
        localHeaders.value.length - 1,
        localHeaders.value
      )
    } else {
      localHeaders.value = changeHeadersSort(
        index,
        index - 1,
        localHeaders.value
      )
    }
  } else {
    if (index === localHeaders.value.length - 1) {
      localHeaders.value = changeHeadersSort(index, 0, localHeaders.value)
    } else {
      localHeaders.value = changeHeadersSort(
        index,
        index + 1,
        localHeaders.value
      )
    }
  }
}
const changeHeadersSort = (
  index1: number,
  index2: number,
  array: LocalHeader[]
) => {
  const temp = array[index1]
  array[index1] = array[index2]
  array[index2] = temp
  return array
}
onMounted(() => {
  localHeaders.value.forEach((header) => {
    originHeaders.push(header.prop)
    if (header.format) {
      originHeadersFormatMap[header.prop] = header.format
    }
    originHeadersMap[header.prop] = JSON.parse(JSON.stringify(header))
  })
  handleHeaderChange('none')
})
</script>

<style lang="scss" scopde>
.advcard {
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &__reset {
      width: 40px;
      text-align: center;
      cursor: pointer;
    }
  }
  &-body {
    display: flex;
    flex-direction: column;
    &__check {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 30px;
      .el-checkbox.el-checkbox--large {
        height: 100%;
      }
      .check {
        &-btns {
          width: 40px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          &__icon {
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
