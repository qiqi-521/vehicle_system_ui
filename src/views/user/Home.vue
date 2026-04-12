<template>
  <div class="home-page">
    <!-- 轮播图区域 -->
    <ImagesSlider
      :images="sliderImages"
      :autoplay="true"
      :interval="5000"
      class="hero-slider"
    >
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="gradient-text">专业汽车租赁</span>
          <br />
          <span class="sub-title">开启您的便捷出行之旅</span>
        </h1>
        <p class="hero-desc">
          多款车型任您选择，价格透明，服务周到
        </p>
        <div class="hero-actions">
          <button class="btn-primary" @click="router.push('/vehicles')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <path d="M9 17h6" />
              <circle cx="17" cy="17" r="2" />
            </svg>
            浏览车辆
          </button>
          <button class="btn-secondary" @click="router.push('/guide')">
            了解详情
          </button>
        </div>
      </div>
    </ImagesSlider>

    <!-- 特色服务 -->
    <div class="features-section">
      <div class="section-container">
        <h2 class="section-title">为什么选择我们</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h3>24小时服务</h3>
            <p>全天候在线客服，随时为您解答疑问</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h3>价格透明</h3>
            <p>无隐藏费用，明码标价，让您放心租车</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" />
                <path d="M9 17h6" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>
            <h3>车型丰富</h3>
            <p>经济型、舒适型、豪华型，满足不同需求</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3>安全保障</h3>
            <p>全险覆盖，让您出行无忧</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 租车流程 -->
    <div class="process-section">
      <div class="section-container">
        <h2 class="section-title">租车流程</h2>
        <div class="process-steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>选择车辆</h3>
              <p>浏览车辆列表，选择心仪车型</p>
            </div>
          </div>
          <div class="step-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>提交订单</h3>
              <p>填写租赁信息，确认订单</p>
            </div>
          </div>
          <div class="step-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>取车出行</h3>
              <p>到店验车取车，开启旅程</p>
            </div>
          </div>
          <div class="step-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
          <div class="step">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3>还车结算</h3>
              <p>按时还车，完成结算</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 联系我们 -->
    <div class="cta-section">
      <div class="section-container">
        <h2>准备好开始您的旅程了吗？</h2>
        <p>立即联系我们，获取更多优惠信息</p>
        <button class="btn-primary" @click="router.push('/contact')">
          联系我们
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import ImagesSlider from '@/components/ImagesSlider.vue'

const router = useRouter()

const sliderImages = [
  'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=2000&auto=format&fit=crop'
]
</script>

<style scoped>
.home-page {
  min-height: calc(100vh - 72px - 120px);
}

/* 轮播图区域 */
.hero-slider {
  height: 600px;
}

.hero-content {
  text-align: center;
  color: #fff;
  max-width: 800px;
  padding: 0 20px;
}

.hero-title {
  margin: 0 0 24px 0;
  line-height: 1.2;
}

.gradient-text {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sub-title {
  font-size: 32px;
  font-weight: 500;
  color: #fff;
}

.hero-desc {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 32px 0;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
}

.btn-primary svg {
  width: 20px;
  height: 20px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 30px rgba(59, 130, 246, 0.5);
}

.btn-secondary {
  padding: 14px 32px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 通用样式 */
.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  text-align: center;
  margin: 0 0 48px 0;
}

/* 特色服务 */
.features-section {
  padding: 80px 0;
  background: #fff;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}

.feature-card {
  text-align: center;
  padding: 32px 24px;
  background: #f8fafc;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-icon svg {
  width: 32px;
  height: 32px;
  color: #fff;
}

.feature-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.feature-card p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  line-height: 1.6;
}

/* 租车流程 */
.process-section {
  padding: 80px 0;
  background: linear-gradient(180deg, #f8fafc 0%, #fff 100%);
}

.process-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.step-number {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
}

.step-content h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.step-content p {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.step-arrow {
  color: #cbd5e1;
}

.step-arrow svg {
  width: 24px;
  height: 24px;
}

/* CTA区域 */
.cta-section {
  padding: 80px 0;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  text-align: center;
}

.cta-section h2 {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 12px 0;
}

.cta-section p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 32px 0;
}

.cta-section .btn-primary {
  background: #fff;
  color: #3b82f6;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.cta-section .btn-primary:hover {
  background: #f8fafc;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.3);
}

/* 响应式 */
@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .process-steps {
    flex-wrap: wrap;
  }

  .step-arrow {
    display: none;
  }
}

@media (max-width: 768px) {
  .hero-slider {
    height: 500px;
  }

  .gradient-text {
    font-size: 36px;
  }

  .sub-title {
    font-size: 24px;
  }

  .hero-desc {
    font-size: 16px;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 28px;
  }

  .process-steps {
    flex-direction: column;
  }

  .step {
    width: 100%;
  }

  .cta-section h2 {
    font-size: 24px;
  }
}
</style>
