<template>
  <div class="empty-state">
    <el-empty :image-size="imageSize" :description="description">
      <template v-if="$slots.default">
        <slot />
      </template>
      <template v-else-if="showButton">
        <el-button type="primary" @click="$emit('action')">
          {{ buttonText }}
        </el-button>
      </template>
    </el-empty>
  </div>
</template>

<script setup>
defineProps({
  // 描述文字
  description: {
    type: String,
    default: '暂无数据'
  },
  // 图片尺寸
  imageSize: {
    type: Number,
    default: 120
  },
  // 是否显示按钮
  showButton: {
    type: Boolean,
    default: false
  },
  // 按钮文字
  buttonText: {
    type: String,
    default: '立即添加'
  }
})

defineEmits(['action'])
</script>

<style scoped>
.empty-state {
  padding: 40px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
