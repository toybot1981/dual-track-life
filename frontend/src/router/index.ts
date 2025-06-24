import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getCurrentLocale } from '@/locales'

// 页面组件
import LanguageSelect from '@/views/LanguageSelect.vue'
import WelcomeView from '@/views/WelcomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import TimelineView from '@/views/TimelineView.vue'
import MemoryRecorderView from '@/views/MemoryRecorderView.vue'
import LifeAgentPageView from '@/views/LifeAgentPageView.vue'

const routes = [
  // 语言选择页面
  {
    path: '/language',
    name: 'LanguageSelect',
    component: LanguageSelect
  },
  
  // 英文路由
  {
    path: '/',
    name: 'Welcome',
    component: WelcomeView,
    meta: { locale: 'en' }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { locale: 'en' }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { locale: 'en' }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true, locale: 'en' }
  },
  {
    path: '/timeline',
    name: 'Timeline',
    component: TimelineView,
    meta: { requiresAuth: true, locale: 'en' }
  },
  {
    path: '/memories',
    name: 'MemoryRecorder',
    component: MemoryRecorderView,
    meta: { requiresAuth: true, locale: 'en' }
  },
  {
    path: '/life-agent',
    name: 'LifeAgent',
    component: LifeAgentPageView,
    meta: { requiresAuth: true, locale: 'en' }
  },
  
  // 中文路由
  {
    path: '/cn',
    name: 'WelcomeCN',
    component: WelcomeView,
    meta: { locale: 'zh' }
  },
  {
    path: '/cn/login',
    name: 'LoginCN',
    component: LoginView,
    meta: { locale: 'zh' }
  },
  {
    path: '/cn/register',
    name: 'RegisterCN',
    component: RegisterView,
    meta: { locale: 'zh' }
  },
  {
    path: '/cn/dashboard',
    name: 'DashboardCN',
    component: DashboardView,
    meta: { requiresAuth: true, locale: 'zh' }
  },
  {
    path: '/cn/timeline',
    name: 'TimelineCN',
    component: TimelineView,
    meta: { requiresAuth: true, locale: 'zh' }
  },
  {
    path: '/cn/memories',
    name: 'MemoryRecorderCN',
    component: MemoryRecorderView,
    meta: { requiresAuth: true, locale: 'zh' }
  },
  {
    path: '/cn/life-agent',
    name: 'LifeAgentCN',
    component: LifeAgentPageView,
    meta: { requiresAuth: true, locale: 'zh' }
  },
  
  // 重定向规则
  {
    path: '/:pathMatch(.*)*',
    redirect: () => {
      const locale = getCurrentLocale()
      return locale === 'zh' ? '/cn' : '/'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 设置语言
  if (to.meta.locale) {
    import('@/locales').then(({ setLocale }) => {
      setLocale(to.meta.locale as string)
    })
  }
  
  // 检查认证
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    const locale = getCurrentLocale()
    next(locale === 'zh' ? '/cn/login' : '/login')
  } else {
    next()
  }
})

export default router

