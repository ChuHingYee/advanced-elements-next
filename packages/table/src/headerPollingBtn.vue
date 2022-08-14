<template>
  <ElButton
    type="primary"
    :size="elementSize"
    class="right-polling"
    @click="handlePolling"
  >
    <ElIcon
      :size="elementSize !== 'large' ? 14 : 16"
      :class="[isPolling ? 'is-loading' : '', 'polling-icon']"
    >
      <IconRefreshRight v-if="isPolling" />
      <IconRefresh v-else />
    </ElIcon>
    {{ isPolling ? stopTip : startTip }}
  </ElButton>
</template>

<script lang="ts" setup>
import { computed, inject, onBeforeUnmount } from 'vue'
import { ElButton, ElIcon, useSize } from 'element-plus'
import { useVModel } from '@vueuse/core'
import {
  Refresh as IconRefresh,
  RefreshRight as IconRefreshRight,
} from '@element-plus/icons-vue'
import type { PropType } from 'vue'
import type { AdvTableContext, PollingOptions } from './defaults'
const props = defineProps({
  options: {
    type: Object as PropType<PollingOptions>,
    default: () => {
      return {
        time: 3000,
      }
    },
  },
  isPolling: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(['update:isPolling'])
const startTip = computed(() => {
  return props.options.startTip || '开始轮询'
})
const stopTip = computed(() => {
  return props.options.stopTip || '停止轮询'
})
const isPolling = useVModel(props, 'isPolling', emits)
const elementSize = useSize()
const advTable = inject('advTable', {} as AdvTableContext)
let timer
const handlePolling = async () => {
  if (isPolling.value) {
    pause()
  } else {
    handleIsPollingChange(true)
    if (props.options.immediate) {
      await handleFetch()
    }
    resume()
  }
}
const resume = () => {
  timer = setTimeout(async () => {
    if (isPolling.value) {
      await handleFetch()
      resume()
    }
  }, props.options.time)
}
const pause = () => {
  timer && clearTimeout(timer)
  handleIsPollingChange(false)
}

const handleFetch = () => {
  return new Promise((resolve) => {
    advTable
      .refresh()
      .then(() => {
        props.options.onSuccess && props.options.onSuccess()
      })
      .catch((e) => {
        props.options.onFail && props.options.onFail(e)
      })
      .finally(() => {
        resolve(true)
      })
  })
}

const handleIsPollingChange = (val: boolean) => {
  isPolling.value = val
  props.options.onChange && props.options.onChange()
}

onBeforeUnmount(() => {
  timer && clearTimeout(timer)
})
</script>
