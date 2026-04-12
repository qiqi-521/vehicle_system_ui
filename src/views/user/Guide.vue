<template>
  <div class="guide-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1>租赁须知</h1>
        <p>请仔细阅读以下内容，了解租车相关规则与注意事项</p>
      </div>
    </div>

    <div class="page-content">
      <div class="guide-container">
        <!-- 目录导航 -->
        <div class="toc-nav">
          <div class="toc-title">目录</div>
          <div class="toc-list">
            <a v-for="(section, index) in sections" :key="index" :href="'#section-' + index" class="toc-item">
              {{ section.icon }} {{ section.title }}
            </a>
          </div>
        </div>

        <!-- 内容区域 -->
        <div class="guide-content">
          <div v-for="(section, index) in sections" :key="index" :id="'section-' + index" class="guide-section">
            <div class="section-header">
              <span class="section-icon">{{ section.icon }}</span>
              <h2>{{ section.title }}</h2>
            </div>
            <div class="section-body">
              <div v-for="(item, idx) in section.items" :key="idx" class="guide-item">
                <div class="item-title">{{ item.title }}</div>
                <div class="item-content">
                  <p v-for="(line, lineIdx) in item.lines" :key="lineIdx">{{ line }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const sections = ref([
  {
    icon: '📋',
    title: '一、租车资格与证件要求',
    items: [
      {
        title: '年龄要求',
        lines: [
          '承租人需年满 18 周岁，持有合法有效的中华人民共和国机动车驾驶证（C1 及以上准驾车型，驾龄满 1 年，部分车型需更高驾龄要求），驾驶证在有效期内，无吊销、暂扣等异常状态。'
        ]
      },
      {
        title: '证件要求',
        lines: [
          '取车时需提供本人有效身份证、驾驶证原件，部分车型 / 长租需额外提供信用卡（用于押金预授权），非本人车辆需提供授权证明。'
        ]
      },
      {
        title: '资格限制',
        lines: [
          '存在酒驾、毒驾、严重交通违法记录，或被列入失信被执行人名单的，我司有权拒绝租车服务。'
        ]
      }
    ]
  },
  {
    icon: '🚗',
    title: '二、车辆使用与责任规范',
    items: [
      {
        title: '驾驶权限',
        lines: [
          '仅限租赁合同约定的驾驶人驾驶，严禁将车辆交给无证、准驾不符、酒驾 / 毒驾人员驾驶，严禁转借、转租、抵押、变卖车辆。'
        ]
      },
      {
        title: '使用限制',
        lines: [
          '车辆仅限合法私人 / 商务出行使用，严禁用于营运、竞赛、越野、危险驾驶、走私、运输危险品 / 违禁品等违法违规活动；',
          '不得擅自改装、拆卸、更换车辆部件，不得加装附属设施，不得变更车辆使用性质；',
          '遵守车辆载人、载货限制，严禁超载、客货混装。'
        ]
      },
      {
        title: '行驶范围',
        lines: [
          '默认仅限本市 / 本省范围内行驶，如需跨区域 / 跨省出行，需提前向我司申请并签署补充协议，否则产生的一切责任由承租人承担。'
        ]
      }
    ]
  },
  {
    icon: '💰',
    title: '三、费用、押金与结算规则',
    items: [
      {
        title: '租金计费',
        lines: [
          '日租金按 24 小时 / 天计算，取车时间为计费起点，还车时间为计费终点；',
          '超时还车：4 小时内按小时计费，超过 4 小时按 1 天计费，续租需提前 2 小时申请，未申请续租按违约处理；',
          '租金包含基础保险费用，不含油费、过路费、停车费、违章罚款等额外费用。'
        ]
      },
      {
        title: '押金规则',
        lines: [
          '取车时需缴纳车辆押金（信用卡预授权 / 线上支付），还车验车无异常后，押金在 7-15 个工作日内原路退还；',
          '违章押金：部分车型需额外缴纳违章押金，还车后 30 天无违章记录全额退还，有违章需在 15 天内处理，否则从押金中扣除对应费用及违约金。'
        ]
      },
      {
        title: '其他费用',
        lines: [
          '油费：取车时油量与还车时油量差额按市场价结算，少油补差价，多油不退；',
          '清洁费：车辆严重脏污（如内饰污渍、异味、宠物毛发）需收取清洁费；',
          '异地还车：需提前申请，收取异地还车服务费。'
        ]
      }
    ]
  },
  {
    icon: '🛡️',
    title: '四、保险、事故与违章处理',
    items: [
      {
        title: '保险说明',
        lines: [
          '所有租赁车辆均投保交强险、第三者责任险、车损险、盗抢险等基础商业险，具体保额以车辆保单为准；',
          '承租人可自愿购买不计免赔等增值服务，未购买的，事故中需承担对应免赔额度内的损失。'
        ]
      },
      {
        title: '事故处理',
        lines: [
          '租赁期间发生交通事故 / 车辆损坏，第一时间报警并联系我司客服，不得擅自私了、撤离现场；',
          '因承租人违规驾驶（酒驾、无证、超速等）导致的事故，保险公司拒赔的，全部损失由承租人承担；',
          '事故期间车辆停运损失，按日租金标准由承租人承担。'
        ]
      },
      {
        title: '违章处理',
        lines: [
          '租赁期间产生的交通违章，由承租人在 15 天内自行处理并缴纳罚款；',
          '逾期未处理的，我司将从押金中扣除违章罚款 + 违约金（按罚款金额的 20% 收取），并保留追责权利。'
        ]
      }
    ]
  },
  {
    icon: '📦',
    title: '五、取车、还车与验车流程',
    items: [
      {
        title: '取车验车',
        lines: [
          '取车时双方共同验车，核对车身划痕、凹陷、轮胎、油量、里程数、车辆功能等，签署《车辆交接单》，拍照留存；',
          '未当场提出的车辆问题，视为承租人认可车辆状态，还车时产生的争议由承租人承担。'
        ]
      },
      {
        title: '还车要求',
        lines: [
          '按约定时间、地点还车，保持车辆清洁，油量与取车时一致；',
          '还车时再次验车，确认无新增损伤、无违章后，办理退押金手续。'
        ]
      },
      {
        title: '提前还车',
        lines: [
          '提前还车不退还剩余租金，长租订单按合同约定执行。'
        ]
      }
    ]
  },
  {
    icon: '⚠️',
    title: '六、违约责任与免责条款',
    items: [
      {
        title: '承租人违约',
        lines: [
          '逾期还车、未按约定使用车辆、擅自转租 / 抵押车辆，我司有权收回车辆，并收取违约金（按日租金的 200% 计算）；',
          '因承租人原因导致车辆被扣、损坏、被盗抢的，承租人需承担全部维修费用、停运损失及相关法律责任。'
        ]
      },
      {
        title: '出租方免责',
        lines: [
          '因地震、洪水等不可抗力导致车辆无法使用的，我司仅退还未使用的租金，不承担其他赔偿责任；',
          '因承租人违规驾驶、操作不当导致的损失，我司不承担责任。'
        ]
      }
    ]
  },
  {
    icon: '📞',
    title: '七、其他说明',
    items: [
      {
        title: '',
        lines: [
          '本须知为租赁合同的补充条款，与租赁合同具有同等法律效力；',
          '如有疑问，可联系我司客服咨询，最终解释权归本公司所有。'
        ]
      }
    ]
  }
])
</script>

<style scoped>
.guide-page {
  min-height: calc(100vh - 72px - 120px);
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  padding: 48px 32px;
  text-align: center;
}

.header-content h1 {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px 0;
}

.header-content p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
}

/* 页面内容 */
.page-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px;
}

.guide-container {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 32px;
}

/* 目录导航 */
.toc-nav {
  position: sticky;
  top: 104px;
  height: fit-content;
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.toc-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.toc-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.toc-item {
  font-size: 13px;
  color: #64748b;
  text-decoration: none;
  padding: 10px 12px;
  border-radius: 8px;
  transition: all 0.2s;
  display: block;
}

.toc-item:hover {
  background: #f1f5f9;
  color: #3b82f6;
}

/* 内容区域 */
.guide-content {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.guide-section {
  margin-bottom: 40px;
  scroll-margin-top: 104px;
}

.guide-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e2e8f0;
}

.section-icon {
  font-size: 28px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.section-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.guide-item {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  border-left: 4px solid #3b82f6;
}

.item-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
}

.item-title:empty {
  display: none;
}

.item-content p {
  font-size: 14px;
  color: #475569;
  line-height: 1.8;
  margin: 0 0 8px 0;
}

.item-content p:last-child {
  margin-bottom: 0;
}

/* 响应式 */
@media (max-width: 900px) {
  .guide-container {
    grid-template-columns: 1fr;
  }

  .toc-nav {
    position: static;
    order: -1;
  }

  .toc-list {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
  }

  .toc-item {
    font-size: 12px;
    padding: 8px 12px;
  }
}

@media (max-width: 600px) {
  .page-content {
    padding: 20px;
  }

  .guide-content {
    padding: 20px;
  }

  .section-header h2 {
    font-size: 18px;
  }

  .guide-item {
    padding: 16px;
  }
}
</style>
