<template>
  <el-tag :type="tagType" :size="size" :effect="effect">
    {{ displayText }}
  </el-tag>
</template>

<script setup>
import { computed } from 'vue'
import {
  ORDER_STATUS_TEXT,
  ORDER_STATUS_TYPE,
  VEHICLE_STATUS_TEXT,
  VEHICLE_STATUS_TYPE,
  USER_STATUS_TEXT,
  ADMIN_STATUS_TEXT
} from '@/utils/constants'

const props = defineProps({
  // 状态值
  status: {
    type: [String, Number],
    required: true
  },
  // 状态类型: order | vehicle | user | admin
  type: {
    type: String,
    required: true,
    validator: (val) => ['order', 'vehicle', 'user', 'admin'].includes(val)
  },
  // 标签尺寸
  size: {
    type: String,
    default: 'default'
  },
  // 标签效果
  effect: {
    type: String,
    default: 'light'
  }
})

// 标签类型（颜色）
const tagType = computed(() => {
  switch (props.type) {
    case 'order':
      return ORDER_STATUS_TYPE[props.status] || 'info'
    case 'vehicle':
      return VEHICLE_STATUS_TYPE[props.status] || 'info'
    case 'user':
      return props.status === 1 ? 'success' : 'danger'
    case 'admin':
      return props.status === 1 ? 'success' : 'danger'
    default:
      return 'info'
  }
})

// 显示文本
const displayText = computed(() => {
  switch (props.type) {
    case 'order':
      return ORDER_STATUS_TEXT[props.status] || props.status
    case 'vehicle':
      return VEHICLE_STATUS_TEXT[props.status] || props.status
    case 'user':
      return USER_STATUS_TEXT[props.status] || props.status
    case 'admin':
      return ADMIN_STATUS_TEXT[props.status] || props.status
    default:
      return props.status
  }
})
</script>
