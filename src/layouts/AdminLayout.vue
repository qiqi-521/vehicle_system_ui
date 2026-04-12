<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <el-aside class="sidebar" :width="isCollapse ? '72px' : '240px'">
      <div class="logo">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <path d="M9 17h6" />
            <circle cx="17" cy="17" r="2" />
          </svg>
        </div>
        <transition name="fade">
          <span v-if="!isCollapse" class="logo-text">汽车租赁管理</span>
        </transition>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        router
        class="sidebar-menu"
      >
        <el-menu-item index="/admin/vehicles">
          <el-icon><Van /></el-icon>
          <template #title>车辆管理</template>
        </el-menu-item>
        <el-menu-item index="/admin/orders">
          <el-icon><Document /></el-icon>
          <template #title>订单管理</template>
        </el-menu-item>
      </el-menu>

      <!-- 折叠按钮 -->
      <div class="collapse-toggle" @click="isCollapse = !isCollapse">
        <el-icon>
          <Fold v-if="!isCollapse" />
          <Expand v-else />
        </el-icon>
      </div>
    </el-aside>

    <!-- 右侧内容 -->
    <el-container class="main-container">
      <!-- 顶部栏 -->
      <el-header class="header">
        <div class="header-left">
          <h1 class="page-title">{{ pageTitle }}</h1>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand" trigger="click">
            <div class="admin-dropdown">
              <el-avatar :size="36" class="admin-avatar">
                {{ adminStore.adminInfo?.name?.charAt(0) || adminStore.adminInfo?.username?.charAt(0) || 'A' }}
              </el-avatar>
              <div class="admin-info">
                <span class="admin-name">{{ adminStore.adminInfo?.name || adminStore.adminInfo?.username || '管理员' }}</span>
                <span class="admin-role">系统管理员</span>
              </div>
              <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主内容区 -->
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Van, Document, Fold, Expand, ArrowDown, SwitchButton } from '@element-plus/icons-vue'
import { useAdminStore } from '@/stores/admin'

const router = useRouter()
const route = useRoute()
const adminStore = useAdminStore()

const isCollapse = ref(false)

// 当前激活菜单
const activeMenu = computed(() => {
  const path = route.path
  if (path.startsWith('/admin/vehicles')) {
    return '/admin/vehicles'
  }
  if (path.startsWith('/admin/orders')) {
    return '/admin/orders'
  }
  return path
})

// 页面标题
const pageTitle = computed(() => {
  const titleMap = {
    '/admin/vehicles': '车辆管理',
    '/admin/orders': '订单管理'
  }
  return titleMap[activeMenu.value] || '管理后台'
})

// 下拉菜单命令处理
async function handleCommand(command) {
  if (command === 'logout') {
    try {
      await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      await adminStore.logout()
      router.push('/login?type=admin')
      ElMessage.success('已退出登录')
    } catch (e) {
      // 用户取消
    }
  }
}
</script>

<style scoped>
.admin-layout {
  height: 100vh;
  display: flex;
  background-color: #f0f2f5;
}

/* 侧边栏样式 */
.sidebar {
  background: linear-gradient(180deg, #1e3a5f 0%, #0d2137 100%);
  transition: width 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
}

.logo {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #60a5fa;
  flex-shrink: 0;
}

.logo-icon svg {
  width: 28px;
  height: 28px;
}

.logo-text {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
  letter-spacing: 1px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.sidebar-menu {
  flex: 1;
  border-right: none !important;
  background: transparent !important;
  padding: 8px;
}

.sidebar-menu :deep(.el-menu-item) {
  height: 48px;
  line-height: 48px;
  margin: 4px 0;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  background: transparent;
  transition: all 0.2s ease;
}

.sidebar-menu :deep(.el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.sidebar-menu :deep(.el-menu-item .el-icon) {
  font-size: 18px;
}

.collapse-toggle {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.2s ease;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.collapse-toggle:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

/* 主容器 */
.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 顶部栏 */
.header {
  background-color: #fff;
  height: 72px;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
}

.admin-dropdown {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.admin-dropdown:hover {
  background-color: #f3f4f6;
}

.admin-avatar {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: #fff;
  font-weight: 600;
}

.admin-info {
  display: flex;
  flex-direction: column;
}

.admin-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.admin-role {
  font-size: 12px;
  color: #6b7280;
}

.dropdown-icon {
  color: #9ca3af;
  font-size: 12px;
  transition: transform 0.2s ease;
}

.admin-dropdown:hover .dropdown-icon {
  color: #6b7280;
}

/* 主内容区 */
.main {
  background-color: #f0f2f5;
  padding: 24px;
  overflow-y: auto;
}

/* 下拉菜单样式 */
:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
}
</style>
