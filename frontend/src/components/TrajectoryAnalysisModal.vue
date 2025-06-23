<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-5/6 overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-gray-900">人生轨迹分析</h2>
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
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-start space-x-3">
            <svg class="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 class="font-medium text-green-900 mb-1">轨迹分析说明</h3>
              <p class="text-sm text-green-700">
                AI将基于您的人生事件序列，分析您的成长轨迹、发展模式，并预测未来可能的发展方向。
                请按时间顺序列出您的重要人生事件。
              </p>
            </div>
          </div>
        </div>

        <!-- 人生事件输入 -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              人生事件时间线 <span class="text-red-500">*</span>
            </label>
            <div class="space-y-3">
              <div
                v-for="(event, index) in lifeEvents"
                :key="index"
                class="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg"
              >
                <div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span class="text-sm font-medium text-green-600">{{ index + 1 }}</span>
                </div>
                <div class="flex-1 space-y-2">
                  <div class="flex space-x-3">
                    <input
                      v-model="event.year"
                      type="number"
                      placeholder="年份"
                      class="w-24 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <input
                      v-model="event.title"
                      type="text"
                      placeholder="事件标题"
                      class="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <textarea
                    v-model="event.description"
                    rows="2"
                    placeholder="事件描述和影响..."
                    class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  ></textarea>
                </div>
                <button
                  @click="removeEvent(index)"
                  class="flex-shrink-0 text-red-400 hover:text-red-600"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <button
              @click="addEvent"
              class="mt-3 flex items-center space-x-2 text-green-600 hover:text-green-700"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span>添加事件</span>
            </button>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              当前状况描述
            </label>
            <textarea
              v-model="trajectoryData.currentSituation"
              rows="3"
              placeholder="请描述您当前的生活状况、职业状态、个人感受等..."
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              未来目标和期望
            </label>
            <textarea
              v-model="trajectoryData.futureGoals"
              rows="3"
              placeholder="请描述您的未来目标、期望达到的状态、想要的生活方式等..."
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            ></textarea>
          </div>
        </div>

        <!-- 分析类型选择 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            分析类型 <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label
              v-for="type in analysisTypes"
              :key="type.id"
              :class="[
                'flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-all',
                trajectoryData.analysisType === type.id
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200 hover:bg-gray-50'
              ]"
            >
              <input
                type="radio"
                :value="type.id"
                v-model="trajectoryData.analysisType"
                class="mt-1 w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
              />
              <div>
                <p class="font-medium text-sm text-gray-900">{{ type.name }}</p>
                <p class="text-xs text-gray-600 mt-1">{{ type.description }}</p>
              </div>
            </label>
          </div>
        </div>

        <!-- 分析维度 -->
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
                class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
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
            预测时间范围
          </label>
          <select
            v-model="trajectoryData.timeHorizon"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="1_year">1年内</option>
            <option value="3_years">3年内</option>
            <option value="5_years">5年内</option>
            <option value="10_years">10年内</option>
            <option value="life_long">终生规划</option>
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
            @click="analyzeTrajectory"
            :disabled="!canAnalyze"
            :class="[
              'px-6 py-2 rounded-lg transition-colors',
              canAnalyze
                ? 'bg-green-500 text-white hover:bg-green-600'
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
const lifeEvents = ref([
  { year: '', title: '', description: '' },
  { year: '', title: '', description: '' },
  { year: '', title: '', description: '' }
])

const trajectoryData = ref({
  currentSituation: '',
  futureGoals: '',
  analysisType: 'comprehensive',
  timeHorizon: '5_years'
})

const selectedDimensions = ref<string[]>(['growth_pattern', 'future_prediction', 'recommendations', 'opportunities'])

// 分析类型选项
const analysisTypes = [
  {
    id: 'comprehensive',
    name: '综合分析',
    description: '全面分析成长轨迹、模式识别和未来预测'
  },
  {
    id: 'growth_pattern',
    name: '成长模式',
    description: '重点分析个人成长模式和发展规律'
  },
  {
    id: 'career_trajectory',
    name: '职业轨迹',
    description: '专注于职业发展路径和职场规划'
  },
  {
    id: 'life_balance',
    name: '生活平衡',
    description: '分析生活各方面的平衡和协调发展'
  },
  {
    id: 'decision_pattern',
    name: '决策模式',
    description: '分析决策模式和选择偏好'
  },
  {
    id: 'relationship_evolution',
    name: '关系演变',
    description: '分析人际关系的发展和变化'
  }
]

// 分析维度选项
const analysisDimensions = [
  {
    id: 'growth_pattern',
    name: '成长模式',
    description: '识别个人成长的模式和规律'
  },
  {
    id: 'turning_points',
    name: '转折点',
    description: '识别关键转折点和影响因素'
  },
  {
    id: 'strengths_weaknesses',
    name: '优势劣势',
    description: '分析个人优势和需要改进的方面'
  },
  {
    id: 'future_prediction',
    name: '未来预测',
    description: '基于历史轨迹预测未来发展'
  },
  {
    id: 'recommendations',
    name: '发展建议',
    description: '提供具体的发展策略和建议'
  },
  {
    id: 'opportunities',
    name: '机会识别',
    description: '识别未来可能的机会和方向'
  },
  {
    id: 'risk_assessment',
    name: '风险评估',
    description: '评估潜在风险和挑战'
  },
  {
    id: 'milestone_planning',
    name: '里程碑规划',
    description: '制定阶段性目标和里程碑'
  }
]

// Computed
const canAnalyze = computed(() => {
  const hasValidEvents = lifeEvents.value.some(event => 
    event.year && event.title.trim() && event.description.trim()
  )
  return hasValidEvents && 
         trajectoryData.value.analysisType &&
         selectedDimensions.value.length > 0
})

// Methods
const closeModal = () => {
  emit('close')
}

const addEvent = () => {
  lifeEvents.value.push({ year: '', title: '', description: '' })
}

const removeEvent = (index: number) => {
  if (lifeEvents.value.length > 1) {
    lifeEvents.value.splice(index, 1)
  }
}

const analyzeTrajectory = () => {
  if (!canAnalyze.value) return
  
  // 过滤出有效的事件
  const validEvents = lifeEvents.value.filter(event => 
    event.year && event.title.trim() && event.description.trim()
  )
  
  // 按年份排序
  validEvents.sort((a, b) => parseInt(a.year) - parseInt(b.year))
  
  // 格式化事件为字符串
  const userEvents = validEvents.map(event => 
    `${event.year}年: ${event.title} - ${event.description}`
  ).join('\n')
  
  const analysisData = {
    userEvents,
    currentSituation: trajectoryData.value.currentSituation,
    futureGoals: trajectoryData.value.futureGoals,
    analysisType: trajectoryData.value.analysisType,
    timeHorizon: trajectoryData.value.timeHorizon,
    analysisDimensions: selectedDimensions.value
  }
  
  emit('analyze', analysisData)
}
</script>
