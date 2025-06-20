<template>
  <div class="memory-timeline-container">
    <!-- 时间轴头部 -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <div class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
          <Calendar class="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">回忆时间轴</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">按时间顺序浏览您的珍贵回忆</p>
        </div>
      </div>
      
      <!-- 视图切换 -->
      <div class="flex items-center space-x-2">
        <button
          v-for="view in viewOptions"
          :key="view.value"
          @click="currentView = view.value"
          :class="[
            'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            currentView === view.value
              ? 'bg-purple-600 text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          ]"
        >
          <component :is="view.icon" class="w-4 h-4 mr-2" />
          {{ view.label }}
        </button>
      </div>
    </div>
    
    <!-- 时间轴内容 -->
    <div class="relative">
      <!-- 时间轴线 -->
      <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400 via-pink-400 to-purple-600"></div>
      
      <!-- 时间轴项目 -->
      <div class="space-y-8">
        <div
          v-for="(group, index) in groupedMemories"
          :key="group.date"
          class="relative"
        >
          <!-- 时间节点 -->
          <div class="flex items-center mb-4">
            <div class="relative z-10 flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-800 border-4 border-purple-400 rounded-full shadow-lg">
              <div class="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                <span class="text-white text-xs font-bold">{{ group.memories.length }}</span>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ formatGroupDate(group.date) }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ group.memories.length }} 个回忆
              </p>
            </div>
          </div>
          
          <!-- 回忆列表 -->
          <div class="ml-20 space-y-4">
            <div
              v-for="memory in group.memories"
              :key="memory.id"
              class="relative"
            >
              <!-- 连接线 -->
              <div class="absolute -left-12 top-6 w-8 h-0.5 bg-purple-300"></div>
              
              <!-- 回忆项目 -->
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
                <div class="flex items-start space-x-4">
                  <!-- 媒体缩略图 -->
                  <div class="flex-shrink-0">
                    <div v-if="memory.mediaFiles.length > 0" class="w-16 h-16 rounded-lg overflow-hidden">
                      <img 
                        v-if="memory.mediaFiles[0].type === 'image'"
                        :src="memory.mediaFiles[0].url"
                        :alt="memory.title"
                        class="w-full h-full object-cover"
                      />
                      <div v-else-if="memory.mediaFiles[0].type === 'video'" class="w-full h-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                        <Video class="w-6 h-6 text-white" />
                      </div>
                      <div v-else-if="memory.mediaFiles[0].type === 'audio'" class="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                        <Music class="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div v-else class="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg flex items-center justify-center">
                      <FileText class="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                  
                  <!-- 内容 -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between">
                      <div class="flex-1">
                        <h4 class="font-medium text-gray-900 dark:text-white mb-1">
                          {{ memory.title }}
                        </h4>
                        <p class="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                          {{ memory.content }}
                        </p>
                        
                        <!-- 元数据 -->
                        <div class="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <div class="flex items-center space-x-1">
                            <Clock class="w-3 h-3" />
                            <span>{{ formatTime(memory.createdAt) }}</span>
                          </div>
                          
                          <div class="flex items-center space-x-1">
                            <Heart :class="getEmotionColor(memory.emotions.sentiment)" class="w-3 h-3" />
                            <span>{{ memory.emotions.primary }}</span>
                          </div>
                          
                          <div v-if="memory.location" class="flex items-center space-x-1">
                            <MapPin class="w-3 h-3" />
                            <span>{{ memory.location.city }}</span>
                          </div>
                          
                          <div class="flex items-center space-x-1">
                            <Star class="w-3 h-3 text-yellow-400" />
                            <span>{{ memory.importance }}/10</span>
                          </div>
                        </div>
                        
                        <!-- 标签 -->
                        <div v-if="memory.tags.length > 0" class="flex flex-wrap gap-1 mt-2">
                          <span
                            v-for="tag in memory.tags.slice(0, 3)"
                            :key="tag"
                            class="inline-block px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs"
                          >
                            {{ tag }}
                          </span>
                        </div>
                      </div>
                      
                      <!-- 操作按钮 -->
                      <div class="flex items-center space-x-1 ml-4">
                        <button
                          @click="$emit('view', memory)"
                          class="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded transition-colors"
                          title="查看详情"
                        >
                          <Eye class="w-4 h-4" />
                        </button>
                        <button
                          @click="$emit('edit', memory)"
                          class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                          title="编辑"
                        >
                          <Edit3 class="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-if="groupedMemories.length === 0" class="text-center py-12">
        <div class="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar class="w-12 h-12 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">还没有回忆记录</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">开始记录您的第一个珍贵回忆吧</p>
        <button
          @click="$emit('create')"
          class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          创建回忆
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { 
  Calendar, Clock, Heart, MapPin, Star, Eye, Edit3,
  Video, Music, FileText, List, Grid
} from 'lucide-vue-next'
import type { Memory } from '@/stores/memory'

interface Props {
  memories: Memory[]
}

interface Emits {
  (e: 'view', memory: Memory): void
  (e: 'edit', memory: Memory): void
  (e: 'create'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 视图选项
const viewOptions = [
  { value: 'timeline', label: '时间轴', icon: List },
  { value: 'grid', label: '网格', icon: Grid }
]

const currentView = ref('timeline')

// 计算属性
const groupedMemories = computed(() => {
  const groups: { [key: string]: Memory[] } = {}
  
  props.memories.forEach(memory => {
    const date = new Date(memory.createdAt).toISOString().split('T')[0]
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(memory)
  })
  
  return Object.entries(groups)
    .map(([date, memories]) => ({
      date,
      memories: memories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
})

// 方法
const formatGroupDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (dateStr === today.toISOString().split('T')[0]) {
    return '今天'
  } else if (dateStr === yesterday.toISOString().split('T')[0]) {
    return '昨天'
  } else {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }
}

const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getEmotionColor = (sentiment: string) => {
  switch (sentiment) {
    case 'positive':
      return 'text-green-500'
    case 'negative':
      return 'text-red-500'
    default:
      return 'text-gray-500'
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.memory-timeline-container {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

/* 自定义滚动条 */
.memory-timeline-container::-webkit-scrollbar {
  width: 6px;
}

.memory-timeline-container::-webkit-scrollbar-track {
  background: transparent;
}

.memory-timeline-container::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.memory-timeline-container::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>

