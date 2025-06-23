<template>
  <div class="create-event-view min-h-screen bg-gray-50">
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
              <h1 class="text-2xl font-bold text-gray-900">记录新事件</h1>
              <p class="text-sm text-gray-600">记录您人生中的重要时刻</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow-sm border">
        <form @submit.prevent="saveEvent" class="p-6 space-y-6">
          <!-- 基本信息 -->
          <div class="space-y-4">
            <h2 class="text-lg font-semibold text-gray-900 border-b pb-2">基本信息</h2>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                事件标题 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="eventForm.title"
                type="text"
                required
                placeholder="为这个重要时刻起个标题..."
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                事件描述 <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="eventForm.description"
                required
                rows="4"
                placeholder="详细描述这个事件的背景、过程和结果..."
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  事件类型 <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="eventForm.type"
                  required
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">请选择事件类型</option>
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
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  事件日期 <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="eventForm.date"
                  type="date"
                  required
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <!-- 情感和重要性 -->
          <div class="space-y-4">
            <h2 class="text-lg font-semibold text-gray-900 border-b pb-2">情感和重要性</h2>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                当时的情感状态
              </label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <label
                  v-for="emotion in emotionOptions"
                  :key="emotion.value"
                  :class="[
                    'flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-all',
                    eventForm.emotion === emotion.value
                      ? 'border-blue-300 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  ]"
                >
                  <input
                    type="radio"
                    :value="emotion.value"
                    v-model="eventForm.emotion"
                    class="sr-only"
                  />
                  <span class="text-lg">{{ emotion.emoji }}</span>
                  <span class="text-sm font-medium">{{ emotion.label }}</span>
                </label>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                重要程度 (1-10分)
              </label>
              <div class="flex items-center space-x-4">
                <input
                  v-model.number="eventForm.importance"
                  type="range"
                  min="1"
                  max="10"
                  class="flex-1"
                />
                <div class="w-12 text-center">
                  <span class="text-lg font-semibold text-blue-600">{{ eventForm.importance }}</span>
                </div>
              </div>
              <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>不太重要</span>
                <span>非常重要</span>
              </div>
            </div>
          </div>

          <!-- 详细信息 -->
          <div class="space-y-4">
            <h2 class="text-lg font-semibold text-gray-900 border-b pb-2">详细信息</h2>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                地点
              </label>
              <input
                v-model="eventForm.location"
                type="text"
                placeholder="事件发生的地点..."
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                参与人员
              </label>
              <input
                v-model="eventForm.participants"
                type="text"
                placeholder="参与这个事件的其他人员..."
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                学到的经验
              </label>
              <textarea
                v-model="eventForm.lessons"
                rows="3"
                placeholder="从这个事件中学到了什么？有什么感悟？"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                标签
              </label>
              <input
                v-model="eventForm.tags"
                type="text"
                placeholder="用逗号分隔的标签，如：毕业,成长,里程碑"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- AI分析选项 -->
          <div class="space-y-4">
            <h2 class="text-lg font-semibold text-gray-900 border-b pb-2">AI分析</h2>
            
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="font-medium text-blue-900 mb-1">智能分析建议</h3>
                  <p class="text-sm text-blue-700 mb-3">
                    保存事件后，您可以使用AI功能对这个事件进行深度分析，获得专业的洞察和建议。
                  </p>
                  <label class="flex items-center space-x-2">
                    <input
                      v-model="eventForm.enableAIAnalysis"
                      type="checkbox"
                      class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span class="text-sm text-blue-700">保存后自动进行AI分析</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex items-center justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              @click="goBack"
              class="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="button"
              @click="saveDraft"
              class="px-6 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
            >
              保存草稿
            </button>
            <button
              type="submit"
              :disabled="!isFormValid"
              :class="[
                'px-6 py-2 rounded-lg transition-colors',
                isFormValid
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              ]"
            >
              保存事件
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 表单数据
const eventForm = ref({
  title: '',
  description: '',
  type: '',
  date: '',
  emotion: '',
  importance: 5,
  location: '',
  participants: '',
  lessons: '',
  tags: '',
  enableAIAnalysis: false
})

// 情感选项
const emotionOptions = [
  { value: 'excited', label: '兴奋', emoji: '😆' },
  { value: 'happy', label: '开心', emoji: '😊' },
  { value: 'satisfied', label: '满足', emoji: '😌' },
  { value: 'neutral', label: '平静', emoji: '😐' },
  { value: 'worried', label: '担忧', emoji: '😟' },
  { value: 'sad', label: '悲伤', emoji: '😢' },
  { value: 'angry', label: '愤怒', emoji: '😠' },
  { value: 'confused', label: '困惑', emoji: '😕' },
  { value: 'nervous', label: '紧张', emoji: '😰' },
  { value: 'proud', label: '自豪', emoji: '😤' },
  { value: 'grateful', label: '感激', emoji: '🙏' },
  { value: 'mixed', label: '复杂', emoji: '😵' }
]

// 计算属性
const isFormValid = computed(() => {
  return eventForm.value.title.trim() &&
         eventForm.value.description.trim() &&
         eventForm.value.type &&
         eventForm.value.date
})

// 方法
const goBack = () => {
  if (hasUnsavedChanges()) {
    if (confirm('您有未保存的更改，确定要离开吗？')) {
      router.push('/events')
    }
  } else {
    router.push('/events')
  }
}

const hasUnsavedChanges = () => {
  return eventForm.value.title.trim() ||
         eventForm.value.description.trim() ||
         eventForm.value.type ||
         eventForm.value.date
}

const saveDraft = () => {
  // 保存草稿到本地存储
  localStorage.setItem('eventDraft', JSON.stringify(eventForm.value))
  alert('草稿已保存')
}

const saveEvent = async () => {
  if (!isFormValid.value) return
  
  try {
    // 这里应该调用API保存事件
    const eventData = {
      ...eventForm.value,
      id: Date.now(), // 临时ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    console.log('保存事件:', eventData)
    
    // 清除草稿
    localStorage.removeItem('eventDraft')
    
    // 如果启用了AI分析，跳转到分析页面
    if (eventForm.value.enableAIAnalysis) {
      router.push({
        name: 'LifeAgent',
        query: { 
          action: 'analyze',
          eventId: eventData.id.toString()
        }
      })
    } else {
      router.push('/events')
    }
    
    alert('事件保存成功！')
  } catch (error) {
    console.error('保存事件失败:', error)
    alert('保存失败，请重试')
  }
}

// 页面加载时恢复草稿
const loadDraft = () => {
  const draft = localStorage.getItem('eventDraft')
  if (draft) {
    try {
      const draftData = JSON.parse(draft)
      if (confirm('发现未完成的草稿，是否恢复？')) {
        eventForm.value = { ...eventForm.value, ...draftData }
      } else {
        localStorage.removeItem('eventDraft')
      }
    } catch (error) {
      console.error('恢复草稿失败:', error)
      localStorage.removeItem('eventDraft')
    }
  }
}

// 初始化
loadDraft()
</script>

<style scoped>
/* 自定义样式 */
</style>

