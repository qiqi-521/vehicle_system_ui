<template>
  <div class="recruit-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div class="header-text">
          <h1>人才招聘</h1>
          <p>加入我们，共创未来</p>
        </div>
      </div>
    </div>

    <!-- 招聘说明 -->
    <div class="content-section">
      <div class="section-card">
        <div class="card-header">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <h2>应聘须知</h2>
        </div>
        <div class="card-body">
          <div class="notice-list">
            <div class="notice-item">
              <span class="notice-number">一</span>
              <p>各招聘职位的详情请留意招贤纳士中的招聘信息。</p>
            </div>
            <div class="notice-item">
              <span class="notice-number">二</span>
              <p>您可以将应聘简历发送至公司总部人力资源部招聘邮箱</p>
            </div>
            <div class="notice-item">
              <span class="notice-number">三</span>
              <p>凡来我公司应聘者须提交您的彩色免冠证件照一张，通过邮箱发送简历者请在附件里提交。</p>
            </div>
            <div class="notice-item">
              <span class="notice-number">四</span>
              <p>我们会及时处理您的应聘，通过简历筛选的人员我们会与您联系，并安排面试时间，请勿来电来访。</p>
            </div>
            <div class="notice-item">
              <span class="notice-number">五</span>
              <p>最新招聘信息，敬请关注各大招聘网站</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 联系信息 -->
      <div class="contact-card">
        <div class="card-header">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <h2>联系方式</h2>
        </div>
        <div class="card-body">
          <div class="company-name">河北科技大学租车公司</div>
          <div class="contact-info">
            <div class="info-row">
              <span class="info-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                联系人
              </span>
              <span class="info-value">靳经理</span>
            </div>
            <div class="info-row">
              <span class="info-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
                手机
              </span>
              <span class="info-value phone">13801227668</span>
            </div>
            <div class="info-row">
              <span class="info-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                地址
              </span>
              <span class="info-value">河北科技大学新校区</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.recruit-page {
  min-height: calc(100vh - 72px - 120px);
  background: #f8fafc;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
  padding: 60px 32px;
  color: #fff;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 24px;
}

.header-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon svg {
  width: 40px;
  height: 40px;
}

.header-text h1 {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.header-text p {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
}

/* 内容区域 */
.content-section {
  max-width: 900px;
  margin: -30px auto 40px;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 卡片样式 */
.section-card,
.contact-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid #e2e8f0;
}

.card-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon svg {
  width: 20px;
  height: 20px;
  color: #fff;
}

.card-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.card-body {
  padding: 24px;
}

/* 须知列表 */
.notice-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.notice-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 4px solid #7c3aed;
}

.notice-number {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.notice-item p {
  margin: 0;
  color: #475569;
  font-size: 15px;
  line-height: 1.6;
}

/* 联系信息 */
.company-name {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f1f5f9;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 10px;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  min-width: 100px;
}

.info-label svg {
  width: 18px;
  height: 18px;
  color: #7c3aed;
}

.info-value {
  color: #1e293b;
  font-size: 15px;
  font-weight: 500;
}

.info-value.phone {
  font-family: 'SF Mono', 'Courier New', monospace;
  color: #7c3aed;
  font-weight: 600;
}

/* 响应式 */
@media (max-width: 768px) {
  .page-header {
    padding: 40px 20px;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .header-icon {
    width: 64px;
    height: 64px;
  }

  .header-icon svg {
    width: 32px;
    height: 32px;
  }

  .header-text h1 {
    font-size: 28px;
  }

  .content-section {
    margin-top: -20px;
  }

  .notice-item {
    flex-direction: column;
    gap: 12px;
  }

  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
