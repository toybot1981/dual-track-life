<template>
  <div class="not-found-view min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full text-center">
      <!-- 404图标 -->
      <div class="mb-8">
        <div class="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        
        <!-- 404文字 -->
        <div class="text-6xl font-bold text-gray-900 mb-2">404</div>
        <div class="text-xl text-gray-600 mb-4">页面未找到</div>
      </div>

      <!-- 错误信息 -->
      <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-3">抱歉，您访问的页面不存在</h2>
        <p class="text-gray-600 mb-4">
          可能的原因：
        </p>
        <ul class="text-sm text-gray-500 text-left space-y-1 mb-4">
          <li>• 页面地址输入错误</li>
          <li>• 页面已被删除或移动</li>
          <li>• 链接已过期</li>
          <li>• 您没有访问权限</li>
        </ul>
      </div>

      <!-- 操作按钮 -->
      <div class="space-y-3">
        <button
          @click="goBack"
          class="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span>返回上一页</span>
        </button>
        
        <router-link
          to="/dashboard"
          class="w-full px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          <span>回到首页</span>
        </router-link>
        
        <router-link
          to="/events"
          class="w-full px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 2m8-2l2 2m-2-2v12a2 2 0 01-2 2H10a2 2 0 01-2-2V9"></path>
          </svg>
          <span>查看人生事件</span>
        </router-link>
        
        <router-link
          to="/life-agent"
          class="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors flex items-center justify-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
          <span>体验Life Agent</span>
        </router-link>
      </div>

      <!-- 帮助信息 -->
      <div class="mt-8 text-sm text-gray-500">
        <p>如果问题持续存在，请联系我们的技术支持</p>
        <div class="flex items-center justify-center space-x-4 mt-2">
          <a href="mailto:support@dualtracklife.com" class="text-blue-600 hover:text-blue-500">
            邮箱支持
          </a>
          <span>|</span>
          <a href="#" class="text-blue-600 hover:text-blue-500">
            在线帮助
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  // 如果有历史记录，返回上一页；否则跳转到首页
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/dashboard')
  }
}

// 页面加载时记录404错误
console.warn('404 Page Not Found:', window.location.pathname)

// 可以在这里添加错误上报逻辑
// reportError('404', window.location.pathname)
</script>

<style scoped>
/* 自定义动画效果 */
.not-found-view {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 按钮悬停效果 */
button, a {
  transition: all 0.2s ease-in-out;
}

button:hover, a:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>

