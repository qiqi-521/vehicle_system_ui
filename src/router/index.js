import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // 登录页面（统一）
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录' }
  },
  // 注册页面
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { title: '注册' }
  },
  // 用户端路由
  {
    path: '/',
    component: () => import('@/layouts/UserLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/user/Home.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'vehicles',
        name: 'VehicleList',
        component: () => import('@/views/user/VehicleList.vue'),
        meta: { title: '车辆列表' }
      },
      {
        path: 'vehicle/:id',
        name: 'VehicleDetail',
        component: () => import('@/views/user/VehicleDetail.vue'),
        meta: { title: '车辆详情' }
      },
      {
        path: 'rent/:vehicleId',
        name: 'RentOrder',
        component: () => import('@/views/user/RentOrder.vue'),
        meta: { title: '立即租赁', requiresUserAuth: true }
      },
      {
        path: 'orders',
        name: 'UserOrders',
        component: () => import('@/views/user/MyOrders.vue'),
        meta: { title: '我的订单', requiresUserAuth: true }
      },
      {
        path: 'order/:id',
        name: 'OrderDetail',
        component: () => import('@/views/user/OrderDetail.vue'),
        meta: { title: '订单详情', requiresUserAuth: true }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/user/Profile.vue'),
        meta: { title: '个人中心', requiresUserAuth: true }
      },
      {
        path: 'feedback',
        name: 'MyFeedback',
        component: () => import('@/views/user/MyFeedback.vue'),
        meta: { title: '留言反馈', requiresUserAuth: true }
      },
      {
        path: 'guide',
        name: 'Guide',
        component: () => import('@/views/user/Guide.vue'),
        meta: { title: '租赁须知' }
      },
      {
        path: 'recruit',
        name: 'Recruit',
        component: () => import('@/views/user/Recruit.vue'),
        meta: { title: '人才招聘' }
      },
      {
        path: 'contact',
        name: 'Contact',
        component: () => import('@/views/user/Contact.vue'),
        meta: { title: '联系我们' }
      }
    ]
  },
  // 管理端路由
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAdminAuth: true },
    children: [
      {
        path: '',
        redirect: '/admin/vehicles'
      },
      {
        path: 'vehicles',
        name: 'AdminVehicles',
        component: () => import('@/views/admin/VehicleList.vue'),
        meta: { title: '车辆管理' }
      },
      {
        path: 'vehicles/add',
        name: 'AdminVehicleAdd',
        component: () => import('@/views/admin/VehicleForm.vue'),
        meta: { title: '新增车辆' }
      },
      {
        path: 'vehicles/edit/:id',
        name: 'AdminVehicleEdit',
        component: () => import('@/views/admin/VehicleForm.vue'),
        meta: { title: '编辑车辆' }
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: () => import('@/views/admin/OrderList.vue'),
        meta: { title: '订单管理' }
      },
      {
        path: 'banners',
        name: 'AdminBanners',
        component: () => import('@/views/admin/BannerManage.vue'),
        meta: { title: '轮播图管理' }
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/UserManage.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: 'contacts',
        name: 'AdminContacts',
        component: () => import('@/views/admin/ContactManage.vue'),
        meta: { title: '留言管理' }
      },
      {
        path: 'statistics',
        name: 'AdminStatistics',
        component: () => import('@/views/admin/Statistics.vue'),
        meta: { title: '订单分析' }
      },
      {
        path: 'vehicle-statistics',
        name: 'AdminVehicleStatistics',
        component: () => import('@/views/admin/VehicleStatistics.vue'),
        meta: { title: '车辆分析' }
      },
      {
        path: 'user-statistics',
        name: 'AdminUserStatistics',
        component: () => import('@/views/admin/UserStatistics.vue'),
        meta: { title: '用户分析' }
      }
    ]
  },
  // 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '页面不存在' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 汽车租赁系统` : '汽车租赁系统'

  // 用户端认证检查
  if (to.meta.requiresUserAuth) {
    const userToken = localStorage.getItem('userToken')
    if (!userToken) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }
  }

  // 管理端认证检查
  if (to.meta.requiresAdminAuth) {
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      next({ name: 'Login', query: { redirect: to.fullPath, type: 'admin' } })
      return
    }
  }

  next()
})

export default router
