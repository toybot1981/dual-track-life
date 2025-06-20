<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span class="text-white font-bold text-2xl">DT</span>
        </div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          {{ $t('auth.login.title') }}
        </h1>
        <p class="text-gray-600">{{ $t('auth.login.subtitle') }}</p>
      </div>

      <!-- Language Switcher -->
      <div class="flex justify-center mb-6">
        <div class="relative">
          <button
            @click="showLanguageMenu = !showLanguageMenu"
            class="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg border border-gray-200"
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
      </div>

      <!-- Login Form -->
      <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Username/Email -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('auth.login.username') }}
            </label>
            <input
              id="username"
              v-model="formData.username"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              :placeholder="$t('auth.login.username')"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('auth.login.password') }}
            </label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              :placeholder="$t('auth.login.password')"
            />
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input
                v-model="formData.rememberMe"
                type="checkbox"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-600">{{ $t('auth.login.rememberMe') }}</span>
            </label>
            <a href="#" class="text-sm text-blue-600 hover:text-blue-700 transition-colors">
              {{ $t('auth.login.forgotPassword') }}
            </a>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4">
            <p class="text-red-600 text-sm">{{ error }}</p>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <span v-if="isLoading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ $t('common.loading') }}
            </span>
            <span v-else>{{ $t('auth.login.loginButton') }}</span>
          </button>

          <!-- Demo Login Button -->
          <button
            type="button"
            @click="handleDemoLogin"
            :disabled="isLoading"
            class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2"
          >
            <span>🎭</span>
            <span>{{ $t('auth.login.demoLogin') }}</span>
          </button>
        </form>

        <!-- Sign Up Link -->
        <div class="mt-6 text-center">
          <p class="text-gray-600">
            {{ $t('auth.login.noAccount') }}
            <router-link
              :to="currentLocale === 'zh' ? '/cn/register' : '/register'"
              class="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              {{ $t('auth.login.signUp') }}
            </router-link>
          </p>
        </div>
      </div>

      <!-- Back to Home -->
      <div class="text-center mt-6">
        <router-link
          :to="currentLocale === 'zh' ? '/cn' : '/'"
          class="text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← {{ $t('common.back') }}{{ $t('nav.home') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getCurrentLocale, setLocale } from '@/locales'

const router = useRouter()
const authStore = useAuthStore()

const showLanguageMenu = ref(false)
const currentLocale = ref(getCurrentLocale())
const isLoading = ref(false)
const error = ref('')

const formData = reactive({
  username: '',
  password: '',
  rememberMe: false
})

const handleSubmit = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  error.value = ''
  
  try {
    const result = await authStore.login({
      username: formData.username,
      password: formData.password
    })
    
    if (result.success) {
      const locale = getCurrentLocale()
      router.push(locale === 'zh' ? '/cn/dashboard' : '/dashboard')
    } else {
      error.value = 'Login failed'
    }
  } catch (err: any) {
    error.value = err.message || 'Login failed'
  } finally {
    isLoading.value = false
  }
}

const handleDemoLogin = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  error.value = ''
  
  try {
    const result = await authStore.demoLogin()
    if (result.success) {
      const locale = getCurrentLocale()
      router.push(locale === 'zh' ? '/cn/dashboard' : '/dashboard')
    } else {
      error.value = 'Demo login failed'
    }
  } catch (err: any) {
    error.value = err.message || 'Demo login failed'
  } finally {
    isLoading.value = false
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
      router.push('/cn/login')
    }
  } else {
    if (currentPath.startsWith('/cn')) {
      router.push('/login')
    }
  }
}
</script>

