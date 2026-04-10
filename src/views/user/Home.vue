<template>
  <div class="home-page">
    <h1>欢迎使用汽车租赁系统</h1>
    <p>请选择您需要的车辆进行租赁</p>
    <el-button type="primary" size="large" @click="router.push('/vehicles')">
      浏览车辆
    </el-button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped>
.home-page {
  text-align: center;
  padding: 60px 20px;
}

.home-page h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 16px;
}

.home-page p {
  font-size: 16px;
  color: #666;
  margin-bottom: 32px;
}
</style>
