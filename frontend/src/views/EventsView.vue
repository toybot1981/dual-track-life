<template>
  <div class="events-view min-h-screen bg-gray-50">
    <!-- 页面头部 -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 2m8-2l2 2m-2-2v12a2 2 0 01-2 2H10a2 2 0 01-2-2V9"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">人生事件</h1>
              <p class="text-sm text-gray-600">记录和管理您的重要人生时刻</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <router-link
              to="/events/create"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>记录新事件</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 筛选和搜索 -->
      <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">搜索事件</label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="输入关键词搜索..."
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">事件类型</label>
            <select
              v-model="selectedType"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">全部类型</option>
              <option value="education">教育学习</option>
              <option value="career">职业发展</option>
              <option value="relationship">人际关系</option>
              <option value="family">家庭生活</option>
              <option value="health">健康医疗</option>
              <option value="finance">财务理财</option>
              <option value="personal_growth">个人成长</option>
              <option value="travel">旅行体验</option>
              <option value="achievement">成就荣誉</option>
              <option value="challenge">挑战困难</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">时间范围</label>
            <select
              v-model="selectedTimeRange"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">全部时间</option>
              <option value="this_year">今年</option>
              <option value="last_year">去年</option>
              <option value="last_3_years">近3年</option>
              <option value="last_5_years">近5年</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">排序方式</label>
            <select
              v-model="sortBy"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date_desc">时间降序</option>
              <option value="date_asc">时间升序</option>
              <option value="importance_desc">重要性降序</option>
              <option value="title_asc">标题升序</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 事件列表 -->
      <div class="space-y-4">
        <div
          v-for="event in filteredEvents"
          :key="event.id"
          class="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
          @click="goToEventDetail(event.id)"
        >
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <div :class="getEventTypeColor(event.type)" class="w-3 h-3 rounded-full"></div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ event.title }}</h3>
                  <span class="text-sm text-gray-500">{{ formatDate(event.date) }}</span>
                </div>
                
                <p class="text-gray-600 mb-3 line-clamp-2">{{ event.description }}</p>
                
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                  <span class="flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                    </svg>
                    <span>{{ getEventTypeName(event.type) }}</span>
                  </span>
                  
                  <span class="flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                    </svg>
                    <span>重要性: {{ event.importance }}/10</span>
                  </span>
                  
                  <span class="flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>{{ getEmotionName(event.emotion) }}</span>
                  </span>
                </div>
              </div>
              
              <div class="flex items-center space-x-2 ml-4">
                <button
                  @click.stop="editEvent(event.id)"
                  class="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                  title="编辑事件"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                
                <button
                  @click.stop="deleteEvent(event.id)"
                  class="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="删除事件"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 空状态 -->
        <div v-if="filteredEvents.length === 0" class="text-center py-12">
          <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 2m8-2l2 2m-2-2v12a2 2 0 01-2 2H10a2 2 0 01-2-2V9"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">暂无事件记录</h3>
          <p class="text-gray-600 mb-4">开始记录您的人生重要时刻吧</p>
          <router-link
            to="/events/create"
            class="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            记录第一个事件
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 响应式数据
const searchQuery = ref('')
const selectedType = ref('')
const selectedTimeRange = ref('')
const sortBy = ref('date_desc')

// 模拟事件数据
const events = ref([
  {
    id: 1,
    title: '大学毕业典礼',
    description: '完成了四年的大学学习，获得了计算机科学学士学位。这是人生的一个重要里程碑，标志着学生时代的结束和职业生涯的开始。',
    type: 'education',
    date: '2023-06-15',
    importance: 9,
    emotion: 'excited',
    createdAt: '2023-06-15T10:00:00Z'
  },
  {
    id: 2,
    title: '第一份工作入职',
    description: '加入了一家科技公司担任前端开发工程师，开始了职业生涯的第一步。虽然有些紧张，但充满期待。',
    type: 'career',
    date: '2023-07-01',
    importance: 8,
    emotion: 'nervous_excited',
    createdAt: '2023-07-01T09:00:00Z'
  },
  {
    id: 3,
    title: '搬到新城市',
    description: '为了工作搬到了一个全新的城市，离开了熟悉的环境和朋友，开始独立生活。',
    type: 'personal_growth',
    date: '2023-06-25',
    importance: 7,
    emotion: 'mixed',
    createdAt: '2023-06-25T14:00:00Z'
  }
])

// 计算属性
const filteredEvents = computed(() => {
  let filtered = [...events.value]
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(event => 
      event.title.toLowerCase().includes(query) || 
      event.description.toLowerCase().includes(query)
    )
  }
  
  // 类型过滤
  if (selectedType.value) {
    filtered = filtered.filter(event => event.type === selectedType.value)
  }
  
  // 时间范围过滤
  if (selectedTimeRange.value) {
    const now = new Date()
    const eventDate = new Date()
    
    switch (selectedTimeRange.value) {
      case 'this_year':
        eventDate.setFullYear(now.getFullYear(), 0, 1)
        break
      case 'last_year':
        eventDate.setFullYear(now.getFullYear() - 1, 0, 1)
        break
      case 'last_3_years':
        eventDate.setFullYear(now.getFullYear() - 3)
        break
      case 'last_5_years':
        eventDate.setFullYear(now.getFullYear() - 5)
        break
    }
    
    filtered = filtered.filter(event => new Date(event.date) >= eventDate)
  }
  
  // 排序
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'date_desc':
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case 'date_asc':
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case 'importance_desc':
        return b.importance - a.importance
      case 'title_asc':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })
  
  return filtered
})

// 方法
const goToEventDetail = (eventId: number) => {
  router.push(`/events/${eventId}`)
}

const editEvent = (eventId: number) => {
  router.push(`/events/${eventId}/edit`)
}

const deleteEvent = (eventId: number) => {
  if (confirm('确定要删除这个事件吗？此操作不可撤销。')) {
    events.value = events.value.filter(event => event.id !== eventId)
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
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
    nervous_excited: '紧张兴奋',
    worried: '担忧',
    sad: '悲伤',
    angry: '愤怒',
    confused: '困惑',
    mixed: '复杂'
  }
  return emotions[emotion as keyof typeof emotions] || '未知'
}

// 生命周期
onMounted(() => {
  // 可以在这里加载真实数据
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

