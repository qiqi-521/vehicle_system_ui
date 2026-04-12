<template>
  <div class="images-slider" :style="{ perspective: '1000px' }">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>

    <!-- 图片轮播 -->
    <template v-else>
      <!-- 遮罩层 -->
      <div v-if="overlay" class="slider-overlay" :class="overlayClassName"></div>

      <!-- 图片 -->
      <Transition :name="transitionName" mode="out-in">
        <img
          :key="currentIndex"
          :src="loadedImages[currentIndex]"
          class="slider-image"
          alt="轮播图片"
        />
      </Transition>

      <!-- 内容插槽 -->
      <div class="slider-content">
        <slot></slot>
      </div>

      <!-- 指示器 -->
      <div class="slider-indicators">
        <span
          v-for="(_, index) in images"
          :key="index"
          class="indicator"
          :class="{ active: index === currentIndex }"
          @click="goTo(index)"
        ></span>
      </div>

      <!-- 导航箭头 -->
      <button class="nav-btn prev" @click="handlePrevious">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button class="nav-btn next" @click="handleNext">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    required: true
  },
  overlay: {
    type: Boolean,
    default: true
  },
  overlayClassName: {
    type: String,
    default: ''
  },
  autoplay: {
    type: Boolean,
    default: true
  },
  interval: {
    type: Number,
    default: 5000
  },
  direction: {
    type: String,
    default: 'up',
    validator: (v) => ['up', 'down'].includes(v)
  }
})

const currentIndex = ref(0)
const loading = ref(true)
const loadedImages = ref([])
let autoplayTimer = null

const transitionName = computed(() => {
  return props.direction === 'up' ? 'slide-up' : 'slide-down'
})

import { computed } from 'vue'

function loadImages() {
  loading.value = true
  const promises = props.images.map((src) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = src
      img.onload = () => resolve(src)
      img.onerror = reject
    })
  })

  Promise.all(promises)
    .then((results) => {
      loadedImages.value = results
      loading.value = false
    })
    .catch((err) => {
      console.error('图片加载失败', err)
      loading.value = false
    })
}

function handleNext() {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

function handlePrevious() {
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}

function goTo(index) {
  currentIndex.value = index
}

function startAutoplay() {
  if (props.autoplay && !autoplayTimer) {
    autoplayTimer = setInterval(handleNext, props.interval)
  }
}

function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

onMounted(() => {
  loadImages()
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})

watch(() => props.images, loadImages, { deep: true })
</script>

<style scoped>
.images-slider {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 500px;
  overflow: hidden;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1e293b;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.slider-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
}

.slider-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.slider-content {
  position: relative;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
}

.slider-indicators {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 30;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  width: 24px;
  border-radius: 4px;
  background: #fff;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 30;
  transition: all 0.3s ease;
  opacity: 0;
}

.images-slider:hover .nav-btn {
  opacity: 1;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.nav-btn svg {
  width: 24px;
  height: 24px;
}

.nav-btn.prev {
  left: 24px;
}

.nav-btn.next {
  right: 24px;
}

/* 过渡动画 */
.slide-up-enter-active,
.slide-up-leave-active,
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 1s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(100%) scale(0.8);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-100%) scale(0.8);
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-100%) scale(0.8);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(100%) scale(0.8);
}
</style>
