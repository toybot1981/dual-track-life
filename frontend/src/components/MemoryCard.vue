<template>
  <div class="memory-card group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
    <!-- 媒体预览区域 -->
    <div v-if="memory.mediaFiles.length > 0" class="relative h-48 overflow-hidden">
      <!-- 图片预览 -->
      <div v-if="primaryMedia?.type === 'image'" class="w-full h-full">
        <img 
          :src="primaryMedia.url" 
          :alt="memory.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <!-- 视频预览 -->
      <div v-else-if="primaryMedia?.type === 'video'" class="w-full h-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
        <Video class="w-12 h-12 text-white" />
      </div>
      
      <!-- 音频预览 -->
      <div v-else-if="primaryMedia?.type === 'audio'" class="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
        <Music class="w-12 h-12 text-white" />
      </div>
      
      <!-- 媒体文件数量指示器 -->
      <div v-if="memory.mediaFiles.length > 1" class="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
        <Images class="w-3 h-3" />
        <span>{{ memory.mediaFiles.length }}</span>
      </div>
      
      <!-- 类型标识 -->
      <div class="absolute top-3 left-3 bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded-full text-xs font-medium">
        {{ getTypeLabel(memory.type) }}
      </div>
    </div>
    
    <!-- 无媒体时的占位区域 -->
    <div v-else class="h-32 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
      <div class="text-center">
        <FileText class="w-8 h-8 text-purple-400 mx-auto mb-2" />
        <span class="text-sm text-purple-600 dark:text-purple-400 font-medium">文字回忆</span>
      </div>
    </div>
    
    <!-- 内容区域 -->
    <div class="p-4">
      <!-- 标题和时间 -->
      <div class="mb-3">
        <h3 class="font-semibold text-gray-900 dark:text-white text-lg mb-1 line-clamp-1">
          {{ memory.title }}
        </h3>
        <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div class="flex items-center space-x-1">
            <Clock class="w-3 h-3" />
            <span>{{ formatDate(memory.createdAt) }}</span>
          </div>
          <div v-if="memory.isPrivate" class="flex items-center space-x-1">
            <Lock class="w-3 h-3" />
            <span>私密</span>
          </div>
        </div>
      </div>
      
      <!-- 内容预览 -->
      <p class="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
        {{ memory.content }}
      </p>
      
      <!-- 情感分析 -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center space-x-2">
          <div class="flex items-center space-x-1">
            <Heart :class="getEmotionColor(memory.emotions.sentiment)" class="w-4 h-4" />
            <span class="text-sm font-medium" :class="getEmotionTextColor(memory.emotions.sentiment)">
              {{ memory.emotions.primary }}
            </span>
          </div>
          <div class="flex items-center space-x-1">
            <div class="w-12 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
              <div 
                class="h-1.5 rounded-full transition-all duration-300"
                :class="getEmotionBgColor(memory.emotions.sentiment)"
                :style="{ width: `${(memory.emotions.intensity / 10) * 100}%` }"
              ></div>
            </div>
            <span class="text-xs text-gray-500">{{ memory.emotions.intensity }}/10</span>
          </div>
        </div>
        
        <!-- 重要性星级 -->
        <div class="flex items-center space-x-1">
          <Star 
            v-for="i in 5" 
            :key="i"
            :class="i <= Math.ceil(memory.importance / 2) ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'"
            class="w-3 h-3"
          />
        </div>
      </div>
      
      <!-- 标签 -->
      <div v-if="memory.tags.length > 0" class="flex flex-wrap gap-1 mb-3">
        <span
          v-for="tag in memory.tags.slice(0, 3)"
          :key="tag"
          class="inline-block px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs"
        >
          {{ tag }}
        </span>
        <span v-if="memory.tags.length > 3" class="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full text-xs">
          +{{ memory.tags.length - 3 }}
        </span>
      </div>
      
      <!-- 位置信息 -->
      <div v-if="memory.location" class="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
        <MapPin class="w-3 h-3" />
        <span class="truncate">{{ memory.location.city }}</span>
      </div>
      
      <!-- 底部信息 -->
      <div class="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <div class="flex items-center space-x-2">
          <span class="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
            {{ memory.category }}
          </span>
          <div v-if="memory.companions?.length" class="flex items-center space-x-1 text-xs text-gray-500">
            <Users class="w-3 h-3" />
            <span>{{ memory.companions.length }}人</span>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            @click.stop="$emit('edit', memory)"
            class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
            title="编辑"
          >
            <Edit3 class="w-4 h-4" />
          </button>
          <button
            @click.stop="$emit('share', memory)"
            class="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded transition-colors"
            title="分享"
          >
            <Share2 class="w-4 h-4" />
          </button>
          <button
            @click.stop="$emit('delete', memory)"
            class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
            title="删除"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- 点击遮罩 -->
    <div 
      @click="$emit('view', memory)"
      class="absolute inset-0 cursor-pointer"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  Clock, Heart, Star, MapPin, Users, Edit3, Share2, Trash2,
  Video, Music, Images, FileText, Lock
} from 'lucide-vue-next'
import type { Memory } from '@/stores/memory'

interface Props {
  memory: Memory
}

interface Emits {
  (e: 'view', memory: Memory): void
  (e: 'edit', memory: Memory): void
  (e: 'share', memory: Memory): void
  (e: 'delete', memory: Memory): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 计算属性
const primaryMedia = computed(() => {
  return props.memory.mediaFiles[0] || null
})

// 方法
const formatDate = (date: Date) => {
  const now = new Date()
  const diffTime = now.getTime() - new Date(date).getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return '今天'
  } else if (diffDays === 1) {
    return '昨天'
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)}周前`
  } else if (diffDays < 365) {
    return `${Math.floor(diffDays / 30)}个月前`
  } else {
    return `${Math.floor(diffDays / 365)}年前`
  }
}

const getTypeLabel = (type: string) => {
  const labels = {
    text: '文字',
    image: '图片',
    audio: '音频',
    video: '视频',
    mixed: '混合'
  }
  return labels[type as keyof typeof labels] || type
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

const getEmotionTextColor = (sentiment: string) => {
  switch (sentiment) {
    case 'positive':
      return 'text-green-700 dark:text-green-400'
    case 'negative':
      return 'text-red-700 dark:text-red-400'
    default:
      return 'text-gray-700 dark:text-gray-400'
  }
}

const getEmotionBgColor = (sentiment: string) => {
  switch (sentiment) {
    case 'positive':
      return 'bg-green-500'
    case 'negative':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

