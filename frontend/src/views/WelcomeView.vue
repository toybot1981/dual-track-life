<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- Header -->
    <header class="relative">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span class="text-white font-bold text-lg">DT</span>
            </div>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {{ $t('welcome.title') }}
            </h1>
          </div>
          <div class="flex items-center space-x-4">
            <!-- Language Switcher -->
            <div class="relative">
              <button
                @click="showLanguageMenu = !showLanguageMenu"
                class="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <span class="text-lg">{{ currentLocale === 'zh' ? '🇨🇳' : '🇺🇸' }}</span>
                <span class="font-medium">{{ $t('language.' + (currentLocale === 'zh' ? 'chinese' : 'english')) }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <!-- Language Dropdown -->
              <div v-if="showLanguageMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <button
                  @click="switchLanguage('en')"
                  class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
                  :class="{ 'bg-blue-50 text-blue-600': currentLocale === 'en' }"
                >
                  <span>🇺🇸</span>
                  <span>English</span>
                </button>
                <button
                  @click="switchLanguage('zh')"
                  class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
                  :class="{ 'bg-blue-50 text-blue-600': currentLocale === 'zh' }"
                >
                  <span>🇨🇳</span>
                  <span>中文</span>
                </button>
              </div>
            </div>
            
            <router-link
              :to="currentLocale === 'zh' ? '/cn/login' : '/login'"
              class="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              {{ $t('nav.login') }}
            </router-link>
            <button
              @click="demoLogin"
              class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg flex items-center space-x-2"
            >
              <span>🎭</span>
              <span>{{ $t('welcome.tryDemo') }}</span>
            </button>
            <router-link
              :to="currentLocale === 'zh' ? '/cn/register' : '/register'"
              class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
            >
              {{ $t('welcome.getStarted') }}
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Hero Section -->
      <div class="text-center mb-20">
        <h1 class="text-5xl md:text-6xl font-bold mb-6">
          <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {{ $t('welcome.title') }}
          </span>
        </h1>
        <p class="text-xl md:text-2xl text-gray-600 mb-4 font-medium">
          {{ $t('welcome.subtitle') }}
        </p>
        <p class="text-lg text-gray-500 max-w-3xl mx-auto mb-12 leading-relaxed">
          {{ $t('welcome.description') }}
        </p>
        
        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <router-link
            :to="currentLocale === 'zh' ? '/cn/register' : '/register'"
            class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg font-semibold"
          >
            {{ $t('welcome.getStarted') }}
          </router-link>
          <button
            @click="demoLogin"
            class="bg-white text-gray-700 px-8 py-4 rounded-2xl border-2 border-gray-200 hover:border-purple-300 hover:text-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg font-semibold flex items-center space-x-2"
          >
            <span>🎭</span>
            <span>{{ $t('welcome.tryDemo') }}</span>
          </button>
        </div>
      </div>

      <!-- Features Section -->
      <div class="mb-20">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
          {{ $t('welcome.features.title') }}
        </h2>
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Real Life Feature -->
          <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50">
            <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <span class="text-2xl">📝</span>
            </div>
            <h3 class="text-xl font-bold mb-4 text-gray-800">{{ $t('welcome.features.realLife.title') }}</h3>
            <p class="text-gray-600 leading-relaxed">{{ $t('welcome.features.realLife.description') }}</p>
          </div>

          <!-- Virtual Life Feature -->
          <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50">
            <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <span class="text-2xl">🎮</span>
            </div>
            <h3 class="text-xl font-bold mb-4 text-gray-800">{{ $t('welcome.features.virtualLife.title') }}</h3>
            <p class="text-gray-600 leading-relaxed">{{ $t('welcome.features.virtualLife.description') }}</p>
          </div>

          <!-- AI Coach Feature -->
          <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50">
            <div class="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
              <span class="text-2xl">🤖</span>
            </div>
            <h3 class="text-xl font-bold mb-4 text-gray-800">{{ $t('welcome.features.aiCoach.title') }}</h3>
            <p class="text-gray-600 leading-relaxed">{{ $t('welcome.features.aiCoach.description') }}</p>
          </div>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="mb-20">
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div class="text-3xl md:text-4xl font-bold mb-2">10K+</div>
              <div class="text-blue-100">{{ $t('welcome.stats.users') }}</div>
            </div>
            <div>
              <div class="text-3xl md:text-4xl font-bold mb-2">50K+</div>
              <div class="text-blue-100">{{ $t('welcome.stats.events') }}</div>
            </div>
            <div>
              <div class="text-3xl md:text-4xl font-bold mb-2">25K+</div>
              <div class="text-blue-100">{{ $t('welcome.stats.simulations') }}</div>
            </div>
            <div>
              <div class="text-3xl md:text-4xl font-bold mb-2">100K+</div>
              <div class="text-blue-100">{{ $t('welcome.stats.insights') }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Final CTA Section -->
      <div class="text-center bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/50">
        <h2 class="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
          {{ $t('welcome.cta.title') }}
        </h2>
        <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          {{ $t('welcome.cta.description') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <router-link
            :to="currentLocale === 'zh' ? '/cn/register' : '/register'"
            class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg font-semibold"
          >
            {{ $t('welcome.cta.register') }}
          </router-link>
          <button
            @click="demoLogin"
            class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg font-semibold flex items-center space-x-2"
          >
            <span>🎭</span>
            <span>{{ $t('welcome.cta.demo') }}</span>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getCurrentLocale, setLocale } from '@/locales'

const router = useRouter()
const authStore = useAuthStore()

const showLanguageMenu = ref(false)
const currentLocale = ref(getCurrentLocale())

const demoLogin = async () => {
  try {
    const result = await authStore.demoLogin()
    if (result.success) {
      const locale = getCurrentLocale()
      router.push(locale === 'zh' ? '/cn/dashboard' : '/dashboard')
    }
  } catch (error) {
    console.error('Demo login failed:', error)
  }
}

const switchLanguage = (locale: 'en' | 'zh') => {
  setLocale(locale)
  currentLocale.value = locale
  showLanguageMenu.value = false
  
  // 根据当前路径和新语言重定向
  const currentPath = router.currentRoute.value.path
  if (locale === 'zh') {
    if (!currentPath.startsWith('/cn')) {
      if (currentPath === '/') {
        router.push('/cn')
      } else if (currentPath === '/login') {
        router.push('/cn/login')
      } else if (currentPath === '/register') {
        router.push('/cn/register')
      } else if (currentPath === '/dashboard') {
        router.push('/cn/dashboard')
      }
    }
  } else {
    if (currentPath.startsWith('/cn')) {
      if (currentPath === '/cn') {
        router.push('/')
      } else if (currentPath === '/cn/login') {
        router.push('/login')
      } else if (currentPath === '/cn/register') {
        router.push('/register')
      } else if (currentPath === '/cn/dashboard') {
        router.push('/dashboard')
      }
    }
  }
}
</script>

