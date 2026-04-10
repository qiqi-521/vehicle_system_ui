<template>
  <div class="user-layout">
    <!-- 顶部导航 -->
    <el-header class="header">
      <div class="container">
        <div class="logo" @click="router.push('/')">
          汽车租赁系统
        </div>
        <el-menu
          :default-active="activeMenu"
          mode="horizontal"
          router
          :ellipsis="false"
          background-color="transparent"
        >
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/vehicles">车辆</el-menu-item>
          <el-menu-item index="/orders" v-if="userStore.isLoggedIn">我的订单</el-menu-item>
        </el-menu>
        <div class="right">
          <template v-if="userStore.isLoggedIn">
            <el-dropdown @command="handleCommand">
              <span class="user-info">
                <el-avatar :size="32" icon="User" />
                <span class="name">{{ userStore.userInfo?.name || userStore.userInfo?.username }}</span>
                <el-icon><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <el-button type="primary" @click="router.push('/login')">登录</el-button>
          </template>
        </div>
      </div>
    </el-header>

    <!-- 主内容区 -->
    <el-main class="main">
      <router-view />
    </el-main>

    <!-- 页脚 -->
    <el-footer class="footer">
      <div class="container">
        <p>&copy; 2024 汽车租赁系统 版权所有</p>
      </div>
    </el-footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 当前激活菜单
const activeMenu = computed(() => {
  const path = route.path
  if (path === '/' || path === '/vehicles' || path.startsWith('/vehicle/')) {
    return path.startsWith('/vehicle/') ? '/vehicles' : path
  }
  if (path === '/orders' || path.startsWith('/order/')) {
    return '/orders'
  }
  return path
})

// 下拉菜单命令处理
async function handleCommand(command) {
  if (command === 'logout') {
    try {
      await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        type: 'warning'
      })
      await userStore.logout()
      router.push('/')
      ElMessage.success('已退出登录')
    } catch (e) {
      // 用户取消
    }
  }
}
</script>

<style scoped>
.user-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  height: 64px;
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header .container {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #409EFF;
  cursor: pointer;
  margin-right: 40px;
}

.el-menu {
  flex: 1;
  border-bottom: none;
}

.right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.user-info .name {
  color: #333;
}

.main {
  flex: 1;
  background-color: #f5f7fa;
  padding: 20px;
}

.footer {
  background-color: #fff;
  border-top: 1px solid #eee;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer .container {
  text-align: center;
  color: #999;
  font-size: 14px;
}
</style>
