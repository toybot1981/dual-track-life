<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span class="text-white font-bold text-2xl">DT</span>
        </div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Dual Track Life
        </h1>
        <p class="text-gray-600">{{ $t('language.selectLanguage') }}</p>
      </div>

      <div class="space-y-4">
        <!-- English -->
        <button
          @click="selectLanguage('en')"
          class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg flex items-center justify-center space-x-3"
        >
          <span class="text-2xl">🇺🇸</span>
          <span class="text-lg font-semibold">English</span>
        </button>

        <!-- Chinese -->
        <button
          @click="selectLanguage('zh')"
          class="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-4 px-6 rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-lg flex items-center justify-center space-x-3"
        >
          <span class="text-2xl">🇨🇳</span>
          <span class="text-lg font-semibold">中文</span>
        </button>
      </div>

      <div class="mt-8 text-center">
        <p class="text-sm text-gray-500">
          {{ $t('language.switchLanguage') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { setLocale } from '@/locales'

const router = useRouter()

const selectLanguage = (locale: string) => {
  setLocale(locale)
  
  // 根据语言选择跳转到相应的路由
  if (locale === 'zh') {
    router.push('/cn')
  } else {
    router.push('/')
  }
}
</script>

