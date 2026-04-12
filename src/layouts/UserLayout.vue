<template>
  <div class="user-layout">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="header-inner">
        <!-- Logo -->
        <router-link to="/" class="logo">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <path d="M9 17h6" />
              <circle cx="17" cy="17" r="2" />
            </svg>
          </div>
          <div class="logo-text">
            <span class="brand-name">汽车租赁</span>
            <span class="brand-slogan">便捷出行</span>
          </div>
        </router-link>

        <!-- 导航菜单 -->
        <nav class="nav-menu">
          <router-link to="/" class="nav-item" :class="{ active: activeMenu === '/' }">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </span>
            <span class="nav-text">首页</span>
          </router-link>
          <router-link to="/vehicles" class="nav-item" :class="{ active: activeMenu === '/vehicles' }">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" />
                <path d="M9 17h6" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </span>
            <span class="nav-text">浏览车辆</span>
          </router-link>
          <router-link to="/guide" class="nav-item" :class="{ active: activeMenu === '/guide' }">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </span>
            <span class="nav-text">租赁须知</span>
          </router-link>
          <router-link to="/contact" class="nav-item" :class="{ active: activeMenu === '/contact' }">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </span>
            <span class="nav-text">联系我们</span>
          </router-link>
        </nav>

        <!-- 右侧操作区 -->
        <div class="header-actions">
          <template v-if="userStore.isLoggedIn">
            <el-dropdown @command="handleCommand" trigger="click" placement="bottom-end">
              <div class="user-dropdown">
                <div class="user-avatar">
                  {{ userStore.userInfo?.name?.charAt(0) || userStore.userInfo?.username?.charAt(0) || 'U' }}
                </div>
                <div class="user-info">
                  <span class="user-name">{{ userStore.userInfo?.name || userStore.userInfo?.username }}</span>
                  <span class="user-role">用户</span>
                </div>
                <svg class="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              <template #dropdown>
                <div class="dropdown-menu">
                  <div class="dropdown-header">
                    <div class="dropdown-avatar">
                      {{ userStore.userInfo?.name?.charAt(0) || userStore.userInfo?.username?.charAt(0) || 'U' }}
                    </div>
                    <div class="dropdown-user-info">
                      <span class="dropdown-name">{{ userStore.userInfo?.name || userStore.userInfo?.username }}</span>
                      <span class="dropdown-email">{{ userStore.userInfo?.email || 'user@example.com' }}</span>
                    </div>
                  </div>
                  <div class="dropdown-divider"></div>
                  <div class="dropdown-item" @click="router.push('/profile')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>个人中心</span>
                  </div>
                  <div class="dropdown-item" @click="router.push('/orders')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <span>我的订单</span>
                  </div>
                  <div class="dropdown-divider"></div>
                  <div class="dropdown-item logout" @click="handleCommand('logout')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>退出登录</span>
                  </div>
                </div>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <router-link to="/login" class="login-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span>登录 / 注册</span>
            </router-link>
          </template>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main">
      <router-view />
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <div class="footer-logo">
            <div class="logo-icon small">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" />
                <path d="M9 17h6" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>
            <span>汽车租赁系统</span>
          </div>
          <p class="copyright">&copy; 2024 汽车租赁系统 版权所有</p>
        </div>
        <div class="footer-links">
          <router-link to="/guide">租赁须知</router-link>
          <router-link to="/contact">联系我们</router-link>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 当前激活菜单
const activeMenu = computed(() => {
  const path = route.path
  if (path === '/') return '/'
  if (path === '/vehicles' || path.startsWith('/vehicle/')) return '/vehicles'
  if (path === '/guide') return '/guide'
  if (path === '/profile' || path === '/orders' || path.startsWith('/order/')) return '/profile'
  if (path === '/contact') return '/contact'
  return ''
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

/* 头部导航 */
.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  max-width: 1280px;
  margin: 0 auto;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 32px;
  position: relative;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  position: absolute;
  left: 32px;
}

.logo-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.logo:hover .logo-icon {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.logo-icon svg {
  width: 24px;
  height: 24px;
  color: #fff;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
}

.brand-slogan {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* 导航菜单 */
.nav-menu {
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 10px;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
}

.nav-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-icon svg {
  width: 20px;
  height: 20px;
}

.nav-item:hover {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.08);
}

.nav-item.active {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.12);
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  border-radius: 3px 3px 0 0;
}

/* 右侧操作区 */
.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  position: absolute;
  right: 32px;
}

/* 登录按钮 */
.login-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  transition: all 0.2s ease;
}

.login-btn svg {
  width: 18px;
  height: 18px;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

/* 用户下拉 */
.user-dropdown {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px 6px 6px;
  background: #f8fafc;
  border-radius: 28px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-dropdown:hover {
  background: #f1f5f9;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.2;
}

.user-role {
  font-size: 11px;
  color: #64748b;
}

.dropdown-arrow {
  width: 16px;
  height: 16px;
  color: #94a3b8;
  transition: transform 0.2s ease;
}

/* 下拉菜单 */
.dropdown-menu {
  padding: 8px;
  min-width: 220px;
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
}

.dropdown-avatar {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.dropdown-user-info {
  display: flex;
  flex-direction: column;
}

.dropdown-name {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.dropdown-email {
  font-size: 12px;
  color: #64748b;
}

.dropdown-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 8px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s ease;
}

.dropdown-item svg {
  width: 18px;
  height: 18px;
  color: #94a3b8;
}

.dropdown-item:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.dropdown-item:hover svg {
  color: #3b82f6;
}

.dropdown-item.logout {
  color: #dc2626;
}

.dropdown-item.logout svg {
  color: #dc2626;
}

.dropdown-item.logout:hover {
  background: #fef2f2;
}

/* 主内容区 */
.main {
  flex: 1;
  background-color: #f8fafc;
  padding: 0;
}

/* 页脚 */
.footer {
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  padding: 40px 0;
}

.footer-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
}

.logo-icon.small {
  width: 36px;
  height: 36px;
  background: rgba(59, 130, 246, 0.2);
  box-shadow: none;
}

.logo-icon.small svg {
  width: 20px;
  height: 20px;
}

.copyright {
  color: #64748b;
  font-size: 13px;
  margin: 0;
}

.footer-links {
  display: flex;
  gap: 32px;
}

.footer-links a {
  color: #94a3b8;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #fff;
}

/* 响应式 */
@media (max-width: 1024px) {
  .header-inner {
    padding: 0 24px;
  }

  .logo-text {
    display: none;
  }

  .nav-item {
    padding: 10px 12px;
  }

  .nav-text {
    display: none;
  }

  .nav-icon {
    width: 22px;
    height: 22px;
  }

  .nav-icon svg {
    width: 22px;
    height: 22px;
  }
}

@media (max-width: 768px) {
  .header-inner {
    padding: 0 16px;
  }

  .logo {
    margin-right: 16px;
  }

  .nav-menu {
    gap: 4px;
  }

  .nav-item {
    padding: 8px 10px;
  }

  .user-info {
    display: none;
  }

  .dropdown-arrow {
    display: none;
  }

  .login-btn span {
    display: none;
  }

  .login-btn {
    padding: 10px;
    border-radius: 50%;
  }

  .footer-inner {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
}
</style>
