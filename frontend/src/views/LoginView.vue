<template>
  <div class="login-view min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div class="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-900">双轨人生</h2>
        <p class="mt-2 text-gray-600">登录您的账户</p>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border p-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              邮箱或用户名
            </label>
            <input
              v-model="loginForm.username"
              type="text"
              required
              placeholder="请输入邮箱或用户名"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              密码
            </label>
            <input
              v-model="loginForm.password"
              type="password"
              required
              placeholder="请输入密码"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input
                v-model="loginForm.remember"
                type="checkbox"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-600">记住我</span>
            </label>
            
            <a href="#" class="text-sm text-blue-600 hover:text-blue-500">
              忘记密码？
            </a>
          </div>
          
          <button
            type="submit"
            :disabled="isLoading"
            :class="[
              'w-full py-3 px-4 rounded-lg transition-colors',
              isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            ]"
          >
            <span v-if="isLoading">登录中...</span>
            <span v-else>登录</span>
          </button>
        </form>
        
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            还没有账户？
            <a href="#" class="text-blue-600 hover:text-blue-500">立即注册</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const loginForm = ref({
  username: '',
  password: '',
  remember: false
})

const isLoading = ref(false)

const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    alert('请填写完整的登录信息')
    return
  }
  
  isLoading.value = true
  
  try {
    // 模拟登录API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟登录成功
    console.log('登录成功:', loginForm.value)
    
    // 保存登录状态
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('user', JSON.stringify({
      id: 1,
      username: loginForm.value.username,
      email: loginForm.value.username
    }))
    
    // 跳转到仪表盘
    router.push('/dashboard')
  } catch (error) {
    console.error('登录失败:', error)
    alert('登录失败，请检查用户名和密码')
  } finally {
    isLoading.value = false
  }
}
</script>

