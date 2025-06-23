import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      title: '双轨人生',
      requiresAuth: false
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: {
      title: '仪表盘',
      requiresAuth: true
    }
  },
  {
    path: '/life-agent',
    name: 'LifeAgent',
    component: () => import('@/views/LifeAgentView.vue'),
    meta: {
      title: 'Life Agent - AI智能助手',
      requiresAuth: true,
      description: '您的智能人生伙伴，提供个性化建议和情感支持'
    },
    children: [
      {
        path: '',
        name: 'LifeAgentHome',
        component: () => import('@/components/LifeAgentModal.vue'),
        meta: {
          title: 'AI助手主页'
        }
      },
      {
        path: 'chat',
        name: 'LifeAgentChat',
        component: () => import('@/components/LifeAgentModal.vue'),
        meta: {
          title: 'AI对话'
        }
      },
      {
        path: 'analysis',
        name: 'LifeAgentAnalysis',
        component: () => import('@/components/EventAnalysisModal.vue'),
        meta: {
          title: '事件分析'
        }
      },
      {
        path: 'trajectory',
        name: 'LifeAgentTrajectory',
        component: () => import('@/components/TrajectoryAnalysisModal.vue'),
        meta: {
          title: '轨迹分析'
        }
      },
      {
        path: 'advice',
        name: 'LifeAgentAdvice',
        component: () => import('@/components/PersonalizedAdviceModal.vue'),
        meta: {
          title: '个性化建议'
        }
      },
      {
        path: 'support',
        name: 'LifeAgentSupport',
        component: () => import('@/components/EmotionalSupportModal.vue'),
        meta: {
          title: '情感支持'
        }
      }
    ]
  },
  {
    path: '/events',
    name: 'Events',
    component: () => import('@/views/EventsView.vue'),
    meta: {
      title: '人生事件',
      requiresAuth: true
    }
  },
  {
    path: '/events/create',
    name: 'CreateEvent',
    component: () => import('@/views/CreateEventView.vue'),
    meta: {
      title: '记录新事件',
      requiresAuth: true
    }
  },
  {
    path: '/events/:id',
    name: 'EventDetail',
    component: () => import('@/views/EventDetailView.vue'),
    meta: {
      title: '事件详情',
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: {
      title: '个人资料',
      requiresAuth: true
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: {
      title: '设置',
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      title: '登录',
      requiresAuth: false
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterView.vue'),
    meta: {
      title: '注册',
      requiresAuth: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: '页面未找到',
      requiresAuth: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    return { top: 0 }
  }
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 双轨人生`
  } else {
    document.title = '双轨人生'
  }

  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    const isAuthenticated = localStorage.getItem('user_token')
    
    if (!isAuthenticated) {
      next({
        name: 'Login',
        query: { redirect: to.fullPath }
      })
      return
    }
  }

  // 如果已登录用户访问登录页面，重定向到仪表盘
  if (to.name === 'Login' && localStorage.getItem('user_token')) {
    next({ name: 'Dashboard' })
    return
  }

  next()
})

export default router

