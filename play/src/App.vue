<template>
  <el-config-provider :locale="locale" size="small">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
const locale = zhCn
</script>
