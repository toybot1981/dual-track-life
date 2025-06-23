<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-5/6 overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-gray-900">人生事件分析</h2>
        </div>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 space-y-6">
        <!-- 说明文字 -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-start space-x-3">
            <svg class="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 class="font-medium text-blue-900 mb-1">事件分析说明</h3>
              <p class="text-sm text-blue-700">
                AI将深度分析您的人生事件，包括其对您人生轨迹的影响、潜在机会、挑战以及应对建议。
                请详细描述事件的背景、过程和您的感受。
              </p>
            </div>
          </div>
        </div>

        <!-- 事件基本信息 -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              事件标题 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="eventData.eventTitle"
              type="text"
              placeholder="例如：大学毕业、换工作、结婚、搬家等"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              事件类型 <span class="text-red-500">*</span>
            </label>
            <select
              v-model="eventData.eventType"
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
              <option value="loss">失去失败</option>
              <option value="other">其他</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              事件详细描述 <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="eventData.eventDescription"
              rows="4"
              placeholder="请详细描述这个事件的背景、过程、结果以及您的感受..."
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              您希望AI重点分析什么？ <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="eventData.userQuery"
              rows="3"
              placeholder="例如：这个事件对我的职业发展有什么影响？我应该如何应对？有什么机会和挑战？"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            ></textarea>
          </div>
        </div>

        <!-- 分析选项 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            分析维度（可多选）
          </label>
          <div class="grid grid-cols-2 gap-3">
            <label
              v-for="dimension in analysisDimensions"
              :key="dimension.id"
              class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                :value="dimension.id"
                v-model="selectedDimensions"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <p class="font-medium text-sm text-gray-900">{{ dimension.name }}</p>
                <p class="text-xs text-gray-600">{{ dimension.description }}</p>
              </div>
            </label>
          </div>
        </div>

        <!-- 时间范围 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            分析时间范围
          </label>
          <select
            v-model="eventData.timeRange"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="immediate">即时影响（当下）</option>
            <option value="short_term">短期影响（1-6个月）</option>
            <option value="medium_term">中期影响（6个月-2年）</option>
            <option value="long_term">长期影响（2年以上）</option>
            <option value="comprehensive">综合分析（全时间段）</option>
          </select>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between p-6 border-t bg-gray-50">
        <div class="text-sm text-gray-600">
          <span class="text-red-500">*</span> 为必填项
        </div>
        <div class="flex space-x-3">
          <button
            @click="closeModal"
            class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            @click="analyzeEvent"
            :disabled="!canAnalyze"
            :class="[
              'px-6 py-2 rounded-lg transition-colors',
              canAnalyze
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            开始分析
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Emits
const emit = defineEmits<{
  close: []
  analyze: [data: any]
}>()

// Reactive data
const eventData = ref({
  eventTitle: '',
  eventType: '',
  eventDescription: '',
  userQuery: '',
  timeRange: 'comprehensive'
})

const selectedDimensions = ref<string[]>(['impact', 'opportunities', 'challenges', 'recommendations'])

// 分析维度选项
const analysisDimensions = [
  {
    id: 'impact',
    name: '影响分析',
    description: '分析事件对人生各方面的影响'
  },
  {
    id: 'opportunities',
    name: '机会识别',
    description: '识别事件带来的潜在机会'
  },
  {
    id: 'challenges',
    name: '挑战评估',
    description: '评估可能面临的挑战和风险'
  },
  {
    id: 'recommendations',
    name: '行动建议',
    description: '提供具体的应对策略和建议'
  },
  {
    id: 'emotional',
    name: '情感分析',
    description: '分析情感反应和心理状态'
  },
  {
    id: 'relationships',
    name: '关系影响',
    description: '分析对人际关系的影响'
  },
  {
    id: 'skills',
    name: '技能发展',
    description: '识别技能提升和学习机会'
  },
  {
    id: 'values',
    name: '价值观',
    description: '探讨对价值观和人生观的影响'
  }
]

// Computed
const canAnalyze = computed(() => {
  return eventData.value.eventTitle.trim() &&
         eventData.value.eventType &&
         eventData.value.eventDescription.trim() &&
         eventData.value.userQuery.trim() &&
         selectedDimensions.value.length > 0
})

// Methods
const closeModal = () => {
  emit('close')
}

const analyzeEvent = () => {
  if (!canAnalyze.value) return
  
  const analysisData = {
    ...eventData.value,
    analysisDimensions: selectedDimensions.value
  }
  
  emit('analyze', analysisData)
}
</script>
