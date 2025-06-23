<template>
  <div class="edit-event-view min-h-screen bg-gray-50">
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
              <h1 class="text-2xl font-bold text-gray-900">编辑事件</h1>
              <p class="text-sm text-gray-600">修改事件信息</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow-sm border">
        <form @submit.prevent="updateEvent" class="p-6 space-y-6">
          <!-- 表单内容与CreateEventView相同，但预填充数据 -->
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
            </div>
          </div>

          <!-- 详细信息 -->
          <div class="space-y-4">
            <h2 class="text-lg font-semibold text-gray-900 border-b pb-2">详细信息</h2>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">地点</label>
              <input
                v-model="eventForm.location"
                type="text"
                placeholder="事件发生的地点..."
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">参与人员</label>
              <input
                v-model="eventForm.participants"
                type="text"
                placeholder="参与这个事件的其他人员..."
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">学到的经验</label>
              <textarea
                v-model="eventForm.lessons"
                rows="3"
                placeholder="从这个事件中学到了什么？有什么感悟？"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">标签</label>
              <input
                v-model="eventForm.tags"
                type="text"
                placeholder="用逗号分隔的标签，如：毕业,成长,里程碑"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex items-center justify-between pt-6 border-t">
            <button
              type="button"
              @click="deleteEvent"
              class="px-6 py-2 text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              删除事件
            </button>
            
            <div class="flex items-center space-x-4">
              <button
                type="button"
                @click="goBack"
                class="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
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
                保存更改
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

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
  tags: ''
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

onMounted(() => {
  loadEvent()
})

const loadEvent = async () => {
  try {
    const eventId = route.params.id
    console.log('加载事件ID:', eventId)
    
    // 模拟加载数据
    const mockEvent = {
      title: '大学毕业典礼',
      description: '完成了四年的大学学习，获得了计算机科学学士学位。',
      type: 'education',
      date: '2023-06-15',
      emotion: 'excited',
      importance: 9,
      location: '大学礼堂',
      participants: '同学、家人、老师',
      lessons: '学习是一个持续的过程，毕业不是结束而是新的开始。',
      tags: '毕业,成长,里程碑,教育'
    }
    
    eventForm.value = mockEvent
  } catch (error) {
    console.error('加载事件失败:', error)
  }
}

const goBack = () => {
  router.push(`/events/${route.params.id}`)
}

const updateEvent = async () => {
  if (!isFormValid.value) return
  
  try {
    console.log('更新事件:', eventForm.value)
    alert('事件更新成功！')
    router.push(`/events/${route.params.id}`)
  } catch (error) {
    console.error('更新事件失败:', error)
    alert('更新失败，请重试')
  }
}

const deleteEvent = () => {
  if (confirm('确定要删除这个事件吗？此操作不可撤销。')) {
    console.log('删除事件:', route.params.id)
    alert('事件已删除')
    router.push('/events')
  }
}
</script>

