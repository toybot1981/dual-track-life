<template>
  <div class="event-detail-view min-h-screen bg-gray-50">
    <!-- 页面头部 -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <button
              @click="goBack"
              class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">事件详情</h1>
              <p class="text-sm text-gray-600">查看事件的详细信息</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <button
              @click="editEvent"
              class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              编辑
            </button>
            <button
              @click="analyzeEvent"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              AI分析
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="event" class="space-y-6">
        <!-- 基本信息卡片 -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <div :class="getEventTypeColor(event.type)" class="w-4 h-4 rounded-full"></div>
                <h2 class="text-2xl font-bold text-gray-900">{{ event.title }}</h2>
              </div>
              <p class="text-gray-600">{{ event.description }}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 2m8-2l2 2m-2-2v12a2 2 0 01-2 2H10a2 2 0 01-2-2V9"></path>
              </svg>
              <span class="text-sm text-gray-600">{{ getEventTypeName(event.type) }}</span>
            </div>
            
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 2m8-2l2 2m-2-2v12a2 2 0 01-2 2H10a2 2 0 01-2-2V9"></path>
              </svg>
              <span class="text-sm text-gray-600">{{ formatDate(event.date) }}</span>
            </div>
            
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
              </svg>
              <span class="text-sm text-gray-600">重要性: {{ event.importance }}/10</span>
            </div>
          </div>
        </div>

        <!-- 详细信息 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">详细信息</h3>
            <div class="space-y-4">
              <div v-if="event.location">
                <label class="block text-sm font-medium text-gray-700 mb-1">地点</label>
                <p class="text-gray-600">{{ event.location }}</p>
              </div>
              
              <div v-if="event.participants">
                <label class="block text-sm font-medium text-gray-700 mb-1">参与人员</label>
                <p class="text-gray-600">{{ event.participants }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">情感状态</label>
                <div class="flex items-center space-x-2">
                  <span class="text-lg">{{ getEmotionEmoji(event.emotion) }}</span>
                  <span class="text-gray-600">{{ getEmotionName(event.emotion) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">学到的经验</h3>
            <p class="text-gray-600">{{ event.lessons || '暂无记录' }}</p>
          </div>
        </div>

        <!-- 标签 -->
        <div v-if="event.tags" class="bg-white rounded-lg shadow-sm border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">标签</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in parseTags(event.tags)"
              :key="tag"
              class="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- AI分析结果 -->
        <div v-if="aiAnalysis" class="bg-white rounded-lg shadow-sm border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">AI分析结果</h3>
          <div class="prose prose-sm max-w-none">
            <p class="text-gray-700 whitespace-pre-wrap">{{ aiAnalysis }}</p>
          </div>
        </div>

        <!-- 时间线信息 -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">时间线信息</h3>
          <div class="space-y-2 text-sm text-gray-600">
            <div class="flex justify-between">
              <span>创建时间:</span>
              <span>{{ formatDateTime(event.createdAt) }}</span>
            </div>
            <div class="flex justify-between">
              <span>最后更新:</span>
              <span>{{ formatDateTime(event.updatedAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-else class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-gray-600">加载中...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const event = ref<any>(null)
const aiAnalysis = ref('')

// 模拟事件数据
const mockEvent = {
  id: 1,
  title: '大学毕业典礼',
  description: '完成了四年的大学学习，获得了计算机科学学士学位。这是人生的一个重要里程碑，标志着学生时代的结束和职业生涯的开始。在典礼上，我感到既兴奋又紧张，对未来充满期待。',
  type: 'education',
  date: '2023-06-15',
  importance: 9,
  emotion: 'excited',
  location: '大学礼堂',
  participants: '同学、家人、老师',
  lessons: '学习是一个持续的过程，毕业不是结束而是新的开始。要保持学习的热情和好奇心，不断提升自己。',
  tags: '毕业,成长,里程碑,教育',
  createdAt: '2023-06-15T10:00:00Z',
  updatedAt: '2023-06-15T10:00:00Z'
}

onMounted(() => {
  loadEvent()
})

const loadEvent = async () => {
  try {
    // 这里应该根据路由参数加载真实数据
    const eventId = route.params.id
    console.log('加载事件ID:', eventId)
    
    // 模拟API调用
    setTimeout(() => {
      event.value = mockEvent
    }, 1000)
  } catch (error) {
    console.error('加载事件失败:', error)
  }
}

const goBack = () => {
  router.push('/events')
}

const editEvent = () => {
  router.push(`/events/${route.params.id}/edit`)
}

const analyzeEvent = () => {
  router.push({
    name: 'LifeAgent',
    query: { 
      action: 'analyze',
      eventId: route.params.id
    }
  })
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

const getEventTypeColor = (type: string) => {
  const colors = {
    education: 'bg-blue-500',
    career: 'bg-green-500',
    relationship: 'bg-pink-500',
    family: 'bg-purple-500',
    health: 'bg-red-500',
    finance: 'bg-yellow-500',
    personal_growth: 'bg-indigo-500',
    travel: 'bg-cyan-500',
    achievement: 'bg-orange-500',
    challenge: 'bg-gray-500'
  }
  return colors[type as keyof typeof colors] || 'bg-gray-500'
}

const getEventTypeName = (type: string) => {
  const names = {
    education: '教育学习',
    career: '职业发展',
    relationship: '人际关系',
    family: '家庭生活',
    health: '健康医疗',
    finance: '财务理财',
    personal_growth: '个人成长',
    travel: '旅行体验',
    achievement: '成就荣誉',
    challenge: '挑战困难'
  }
  return names[type as keyof typeof names] || '其他'
}

const getEmotionName = (emotion: string) => {
  const emotions = {
    excited: '兴奋',
    happy: '开心',
    satisfied: '满足',
    neutral: '平静',
    worried: '担忧',
    sad: '悲伤',
    angry: '愤怒',
    confused: '困惑',
    nervous: '紧张',
    proud: '自豪',
    grateful: '感激',
    mixed: '复杂'
  }
  return emotions[emotion as keyof typeof emotions] || '未知'
}

const getEmotionEmoji = (emotion: string) => {
  const emojis = {
    excited: '😆',
    happy: '😊',
    satisfied: '😌',
    neutral: '😐',
    worried: '😟',
    sad: '😢',
    angry: '😠',
    confused: '😕',
    nervous: '😰',
    proud: '😤',
    grateful: '🙏',
    mixed: '😵'
  }
  return emojis[emotion as keyof typeof emojis] || '😐'
}

const parseTags = (tags: string) => {
  return tags.split(',').map(tag => tag.trim()).filter(tag => tag)
}
</script>

<style scoped>
.prose p {
  margin: 0;
}
</style>

