<template>
  <Transition name="modal" appear>
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- 背景遮罩 -->
      <div 
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
        @click="$emit('close')"
      ></div>
      
      <!-- 模态框内容 -->
      <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden mx-4">
        <!-- 头部 -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Camera class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ isEditing ? '编辑回忆' : '记录新回忆' }}
              </h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ isEditing ? '修改您的珍贵回忆' : '捕捉生活中的美好瞬间' }}
              </p>
            </div>
          </div>
          <button
            @click="$emit('close')"
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X class="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <!-- 内容区域 -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- 标题输入 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                回忆标题 *
              </label>
              <input
                v-model="formData.title"
                type="text"
                required
                placeholder="给这个回忆起个标题..."
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            
            <!-- 内容输入 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                回忆内容 *
              </label>
              <textarea
                v-model="formData.content"
                required
                rows="4"
                placeholder="详细描述这个回忆..."
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
              ></textarea>
              
              <!-- 实时情感分析 -->
              <div v-if="formData.content && emotionPreview" class="mt-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div class="flex items-center space-x-2 text-sm">
                  <Heart class="w-4 h-4 text-purple-600" />
                  <span class="text-purple-700 dark:text-purple-300">
                    检测到情感: {{ emotionPreview.primary }}
                  </span>
                  <div class="flex items-center space-x-1">
                    <div class="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        class="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        :style="{ width: `${(emotionPreview.intensity / 10) * 100}%` }"
                      ></div>
                    </div>
                    <span class="text-xs text-gray-500">{{ emotionPreview.intensity }}/10</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 媒体文件上传 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                添加媒体文件
              </label>
              <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                <input
                  ref="fileInput"
                  type="file"
                  multiple
                  accept="image/*,audio/*,video/*"
                  @change="handleFileUpload"
                  class="hidden"
                />
                <div class="space-y-2">
                  <Upload class="w-8 h-8 text-gray-400 mx-auto" />
                  <div>
                    <button
                      type="button"
                      @click="fileInput?.click()"
                      class="text-purple-600 hover:text-purple-700 font-medium"
                    >
                      点击上传文件
                    </button>
                    <span class="text-gray-500"> 或拖拽文件到此处</span>
                  </div>
                  <p class="text-xs text-gray-400">
                    支持图片、音频、视频文件
                  </p>
                </div>
              </div>
              
              <!-- 已上传文件预览 -->
              <div v-if="formData.mediaFiles.length > 0" class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  v-for="(file, index) in formData.mediaFiles"
                  :key="file.id"
                  class="relative group"
                >
                  <!-- 图片预览 -->
                  <div v-if="file.type === 'image'" class="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img :src="file.url" :alt="file.filename" class="w-full h-full object-cover" />
                  </div>
                  
                  <!-- 音频预览 -->
                  <div v-else-if="file.type === 'audio'" class="aspect-square rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <Music class="w-8 h-8 text-white" />
                  </div>
                  
                  <!-- 视频预览 -->
                  <div v-else-if="file.type === 'video'" class="aspect-square rounded-lg bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                    <Video class="w-8 h-8 text-white" />
                  </div>
                  
                  <!-- 删除按钮 -->
                  <button
                    type="button"
                    @click="removeFile(index)"
                    class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X class="w-4 h-4" />
                  </button>
                  
                  <!-- 文件信息 -->
                  <div class="mt-1 text-xs text-gray-500 truncate">
                    {{ file.filename }}
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 分类和标签 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- 分类选择 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  分类
                </label>
                <select
                  v-model="formData.category"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="个人">个人</option>
                  <option value="社交">社交</option>
                  <option value="工作">工作</option>
                  <option value="学习">学习</option>
                  <option value="旅行">旅行</option>
                  <option value="健康">健康</option>
                  <option value="娱乐">娱乐</option>
                  <option value="家庭">家庭</option>
                  <option value="其他">其他</option>
                </select>
              </div>
              
              <!-- 重要性评级 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  重要性 ({{ formData.importance }}/10)
                </label>
                <input
                  v-model.number="formData.importance"
                  type="range"
                  min="1"
                  max="10"
                  class="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                />
                <div class="flex justify-between text-xs text-gray-500 mt-1">
                  <span>一般</span>
                  <span>重要</span>
                  <span>非常重要</span>
                </div>
              </div>
            </div>
            
            <!-- 标签输入 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                标签
              </label>
              <div class="flex flex-wrap gap-2 mb-2">
                <span
                  v-for="(tag, index) in formData.tags"
                  :key="index"
                  class="inline-flex items-center px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                >
                  {{ tag }}
                  <button
                    type="button"
                    @click="removeTag(index)"
                    class="ml-2 text-purple-500 hover:text-purple-700"
                  >
                    <X class="w-3 h-3" />
                  </button>
                </span>
              </div>
              <div class="flex space-x-2">
                <input
                  v-model="newTag"
                  type="text"
                  placeholder="添加标签..."
                  @keyup.enter="addTag"
                  class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <button
                  type="button"
                  @click="addTag"
                  class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus class="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <!-- 位置信息 -->
            <div v-if="formData.location" class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div class="flex items-center space-x-2 text-sm text-green-700 dark:text-green-300">
                <MapPin class="w-4 h-4" />
                <span>位置: {{ formData.location.address }}</span>
              </div>
            </div>
            
            <!-- 隐私设置 -->
            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div class="flex items-center space-x-3">
                <Lock class="w-5 h-5 text-gray-500" />
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">私密回忆</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">只有您可以查看这个回忆</div>
                </div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="formData.isPrivate"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </form>
        </div>
        
        <!-- 底部按钮 -->
        <div class="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div class="flex items-center space-x-2 text-sm text-gray-500">
            <Clock class="w-4 h-4" />
            <span>{{ new Date().toLocaleString() }}</span>
          </div>
          
          <div class="flex space-x-3">
            <button
              type="button"
              @click="$emit('close')"
              class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              取消
            </button>
            <button
              @click="handleSubmit"
              :disabled="!canSubmit || isSubmitting"
              class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
              <Save v-else class="w-4 h-4" />
              <span>{{ isSubmitting ? '保存中...' : (isEditing ? '更新回忆' : '保存回忆') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { 
  Camera, X, Upload, Heart, Music, Video, Plus, MapPin, 
  Lock, Clock, Save, Loader2
} from 'lucide-vue-next'
import { useMemoryStore, type Memory, type MediaFile, type EmotionAnalysis } from '@/stores/memory'

interface Props {
  show: boolean
  memory?: Memory | null
}

interface Emits {
  (e: 'close'): void
  (e: 'saved', memory: Memory): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const memoryStore = useMemoryStore()

// 表单数据
const formData = ref({
  title: '',
  content: '',
  type: 'text' as 'text' | 'image' | 'audio' | 'video' | 'mixed',
  mediaFiles: [] as MediaFile[],
  category: '个人',
  importance: 5,
  tags: [] as string[],
  isPrivate: false,
  location: null as any
})

const newTag = ref('')
const isSubmitting = ref(false)
const emotionPreview = ref<EmotionAnalysis | null>(null)
const fileInput = ref<HTMLInputElement>()

// 计算属性
const isEditing = computed(() => !!props.memory)

const canSubmit = computed(() => {
  return formData.value.title.trim() && formData.value.content.trim()
})

// 监听内容变化，实时分析情感
watch(() => formData.value.content, async (newContent) => {
  if (newContent && newContent.trim().length > 10) {
    try {
      // 模拟情感分析延迟
      setTimeout(async () => {
        const emotions = ['快乐', '悲伤', '愤怒', '恐惧', '惊讶', '厌恶', '平静', '兴奋', '焦虑', '满足']
        const positiveWords = ['开心', '快乐', '兴奋', '满足', '成功', '美好', '棒', '好']
        const negativeWords = ['难过', '悲伤', '愤怒', '失望', '糟糕', '痛苦', '困难']
        
        const hasPositive = positiveWords.some(word => newContent && newContent.includes(word))
        const hasNegative = negativeWords.some(word => newContent && newContent.includes(word))
        
        let primary = '平静'
        let intensity = 5
        let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral'
        
        if (hasPositive && !hasNegative) {
          sentiment = 'positive'
          primary = '快乐'
          intensity = 7
        } else if (hasNegative && !hasPositive) {
          sentiment = 'negative'
          primary = '悲伤'
          intensity = 6
        }
        
        emotionPreview.value = {
          primary,
          intensity,
          confidence: 0.8,
          keywords: [],
          sentiment
        }
      }, 500)
    } catch (error) {
      console.error('情感分析失败:', error)
    }
  } else {
    emotionPreview.value = null
  }
})

// 文件上传处理
const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (!files) return
  
  for (const file of Array.from(files)) {
    try {
      const mediaFile = await memoryStore.uploadMediaFile(file)
      formData.value.mediaFiles.push(mediaFile)
      
      // 更新类型
      if (formData.value.mediaFiles.length > 0) {
        const hasImage = formData.value.mediaFiles.some(f => f.type === 'image')
        const hasAudio = formData.value.mediaFiles.some(f => f.type === 'audio')
        const hasVideo = formData.value.mediaFiles.some(f => f.type === 'video')
        
        if ((hasImage && hasAudio) || (hasImage && hasVideo) || (hasAudio && hasVideo)) {
          formData.value.type = 'mixed'
        } else if (hasImage) {
          formData.value.type = 'image'
        } else if (hasAudio) {
          formData.value.type = 'audio'
        } else if (hasVideo) {
          formData.value.type = 'video'
        }
      }
    } catch (error) {
      console.error('文件上传失败:', error)
    }
  }
  
  // 清空input
  target.value = ''
}

// 移除文件
const removeFile = (index: number) => {
  formData.value.mediaFiles.splice(index, 1)
  
  // 重新计算类型
  if (formData.value.mediaFiles.length === 0) {
    formData.value.type = 'text'
  }
}

// 添加标签
const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !formData.value.tags.includes(tag)) {
    formData.value.tags.push(tag)
    newTag.value = ''
  }
}

// 移除标签
const removeTag = (index: number) => {
  formData.value.tags.splice(index, 1)
}

// 提交表单
const handleSubmit = async () => {
  if (!canSubmit.value || isSubmitting.value) return
  
  try {
    isSubmitting.value = true
    
    const memoryData = {
      ...formData.value,
      emotions: emotionPreview.value || {
        primary: '平静',
        intensity: 5,
        confidence: 0.5,
        keywords: [],
        sentiment: 'neutral' as const
      }
    }
    
    let result
    if (isEditing.value && props.memory) {
      result = await memoryStore.updateMemory(props.memory.id, memoryData)
    } else {
      result = await memoryStore.createMemory(memoryData)
    }
    
    if (result.success) {
      emit('saved', result.memory!)
      emit('close')
      resetForm()
    } else {
      console.error('保存失败:', result.error)
    }
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    isSubmitting.value = false
  }
}

// 重置表单
const resetForm = () => {
  formData.value = {
    title: '',
    content: '',
    type: 'text',
    mediaFiles: [],
    category: '个人',
    importance: 5,
    tags: [],
    isPrivate: false,
    location: null
  }
  newTag.value = ''
  emotionPreview.value = null
}

// 初始化表单数据
const initializeForm = () => {
  if (props.memory) {
    formData.value = {
      title: props.memory.title,
      content: props.memory.content,
      type: props.memory.type,
      mediaFiles: [...props.memory.mediaFiles],
      category: props.memory.category,
      importance: props.memory.importance,
      tags: [...props.memory.tags],
      isPrivate: props.memory.isPrivate,
      location: props.memory.location
    }
    emotionPreview.value = props.memory.emotions
  } else {
    resetForm()
  }
}

// 监听props变化
watch(() => props.show, (show) => {
  if (show) {
    initializeForm()
  }
})

onMounted(() => {
  if (props.show) {
    initializeForm()
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.slider::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #8b5cf6;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #8b5cf6;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>

