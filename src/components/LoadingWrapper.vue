<template>
  <div class="loading-wrapper" v-loading="loading" :element-loading-text="text">
    <slot v-if="!loading || showContentWhileLoading" />
    <template v-if="loading && !showContentWhileLoading">
      <!-- 加载中占位 -->
    </template>
  </div>
</template>

<script setup>
/**
 * 加载状态包装器组件
 * 用于包裹需要加载状态的内容区域
 */
defineProps({
  // 是否加载中
  loading: {
    type: Boolean,
    default: false
  },
  // 加载提示文字
  text: {
    type: String,
    default: '加载中...'
  },
  // 加载时是否显示内容
  showContentWhileLoading: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.loading-wrapper {
  min-height: 100px;
}
</style>
