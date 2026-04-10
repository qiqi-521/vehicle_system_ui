<template>
  <div class="login-container">
    <!-- 左侧装饰区域 -->
    <div class="login-decoration">
      <div class="decoration-content">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M8 17a4 4 0 0 1 8 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
            <path d="M5.5 21a8.5 8.5 0 1 1 13 0"/>
          </svg>
        </div>
        <h1>汽车租赁系统</h1>
        <p>便捷租车，畅行无忧</p>
      </div>
    </div>

    <!-- 右侧登录表单 -->
    <div class="login-form-wrapper">
      <div class="login-box">
        <h2>欢迎登录</h2>

        <el-form :model="form" :rules="rules" ref="formRef" @keyup.enter="handleLogin">
          <el-form-item prop="username">
            <el-input
              v-model="form.username"
              placeholder="请输入用户名"
              size="large"
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              show-password
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <!-- 身份切换按钮 -->
          <div class="role-switch">
            <el-button
              :class="['role-btn', { active: loginType === 'user' }]"
              @click="loginType = 'user'"
            >
              <el-icon><User /></el-icon>
              用户
            </el-button>
            <el-button
              :class="['role-btn', { active: loginType === 'admin' }]"
              @click="loginType = 'admin'"
            >
              <el-icon><Setting /></el-icon>
              管理员
            </el-button>
          </div>

          <el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              @click="handleLogin"
              class="login-btn"
            >
              登 录
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 用户端显示注册链接 -->
        <div class="register-link" v-if="loginType === 'user'">
          还没有账号？<router-link to="/register">立即注册</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Setting } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useAdminStore } from '@/stores/admin'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const adminStore = useAdminStore()

const formRef = ref(null)
const loading = ref(false)
const loginType = ref('user')

onMounted(() => {
  if (route.query.type === 'admin') {
    loginType.value = 'admin'
  }
})

const form = reactive({
  username: '',
  password: ''
})
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

async function handleLogin() {
  try {
    await formRef.value.validate()
    loading.value = true

    if (loginType.value === 'user') {
      await userStore.login(form.username, form.password)
      ElMessage.success('登录成功')
      const redirect = route.query.redirect || '/'
      router.push(redirect)
    } else {
      await adminStore.login(form.username, form.password)
      ElMessage.success('登录成功')
      const redirect = route.query.redirect || '/admin'
      router.push(redirect)
    }
  } catch (e) {
    // 验证失败或登录失败
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  background: #ECFEFF;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 左侧装饰区域 */
.login-decoration {
  flex: 1;
  background: linear-gradient(135deg, #0891B2 0%, #0E7490 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.login-decoration::before {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  top: -100px;
  left: -100px;
}

.login-decoration::after {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  bottom: -50px;
  right: -50px;
}

.decoration-content {
  text-align: center;
  color: #fff;
  z-index: 1;
}

.logo-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon svg {
  width: 48px;
  height: 48px;
  color: #fff;
}

.decoration-content h1 {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 12px;
}

.decoration-content p {
  font-size: 16px;
  opacity: 0.9;
}

/* 右侧登录表单 */
.login-form-wrapper {
  width: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: #fff;
}

.login-box {
  width: 100%;
  max-width: 360px;
}

.login-box h2 {
  font-size: 28px;
  font-weight: 600;
  color: #164E63;
  margin-bottom: 32px;
}

.login-box :deep(.el-input__wrapper) {
  padding: 4px 16px;
  border-radius: 10px;
  box-shadow: 0 0 0 1px #E2E8F0;
  transition: all 0.2s;
}

.login-box :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #0891B2;
}

.login-box :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(8, 145, 178, 0.2), 0 0 0 1px #0891B2;
}

.login-box :deep(.el-input__inner) {
  height: 44px;
  color: #164E63;
}

.login-box :deep(.el-input__inner::placeholder) {
  color: #94A3B8;
}

/* 身份切换按钮 */
.role-switch {
  display: flex;
  gap: 12px;
  margin: 20px 0;
}

.role-btn {
  flex: 1;
  height: 44px;
  border-radius: 10px;
  border: 1px solid #E2E8F0;
  background: #F8FAFC;
  color: #64748B;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s;
  cursor: pointer;
}

.role-btn:hover {
  border-color: #0891B2;
  color: #0891B2;
}

.role-btn.active {
  background: #0891B2;
  border-color: #0891B2;
  color: #fff;
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  height: 48px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  background: #22C55E;
  border-color: #22C55E;
  transition: all 0.2s;
}

.login-btn:hover {
  background: #16A34A;
  border-color: #16A34A;
}

/* 注册链接 */
.register-link {
  text-align: center;
  margin-top: 20px;
  color: #64748B;
  font-size: 14px;
}

.register-link a {
  color: #0891B2;
  text-decoration: none;
  font-weight: 500;
}

.register-link a:hover {
  text-decoration: underline;
}

/* 响应式 */
@media (max-width: 900px) {
  .login-decoration {
    display: none;
  }

  .login-form-wrapper {
    width: 100%;
  }
}
</style>
