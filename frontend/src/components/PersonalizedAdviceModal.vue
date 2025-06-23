<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-5/6 overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-gray-900">个性化建议</h2>
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
        <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div class="flex items-start space-x-3">
            <svg class="w-5 h-5 text-purple-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 class="font-medium text-purple-900 mb-1">个性化建议说明</h3>
              <p class="text-sm text-purple-700">
                AI将基于您的个人档案、当前状况和目标，为您提供量身定制的建议和指导方案。
                请详细填写以下信息以获得更精准的建议。
              </p>
            </div>
          </div>
        </div>

        <!-- 个人档案 -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              个人档案 <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="adviceData.userProfile"
              rows="4"
              placeholder="请描述您的基本信息：年龄、职业、教育背景、兴趣爱好、性格特点、价值观等..."
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              当前状况 <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="adviceData.currentSituation"
              rows="4"
              placeholder="请描述您当前面临的情况、挑战、困惑或需要改善的方面..."
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              目标和期望 <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="adviceData.goals"
              rows="4"
              placeholder="请描述您的目标、期望达到的状态、想要的改变或成就..."
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            ></textarea>
          </div>
        </div>

        <!-- 优先级和时间框架 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              优先级
            </label>
            <select
              v-model="adviceData.priority"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">请选择优先级</option>
              <option value="urgent">紧急（需要立即行动）</option>
              <option value="high">高（1-3个月内）</option>
              <option value="medium">中（3-6个月内）</option>
              <option value="low">低（6个月以上）</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              时间框架
            </label>
            <select
              v-model="adviceData.timeFrame"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="immediate">即时建议（当下行动）</option>
              <option value="short_term">短期规划（1-6个月）</option>
              <option value="medium_term">中期规划（6个月-2年）</option>
              <option value="long_term">长期规划（2年以上）</option>
              <option value="comprehensive">综合规划（全时间段）</option>
            </select>
          </div>
        </div>

        <!-- 建议类型 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            建议类型（可多选） <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-2 gap-3">
            <label
              v-for="type in adviceTypes"
              :key="type.id"
              class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                :value="type.id"
                v-model="selectedAdviceTypes"
                class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <div>
                <p class="font-medium text-sm text-gray-900">{{ type.name }}</p>
                <p class="text-xs text-gray-600">{{ type.description }}</p>
              </div>
            </label>
          </div>
        </div>

        <!-- 详细程度 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            建议详细程度
          </label>
          <div class="space-y-2">
            <label
              v-for="level in detailLevels"
              :key="level.id"
              :class="[
                'flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-all',
                adviceData.detailLevel === level.id
                  ? 'border-purple-300 bg-purple-50'
                  : 'border-gray-200 hover:bg-gray-50'
              ]"
            >
              <input
                type="radio"
                :value="level.id"
                v-model="adviceData.detailLevel"
                class="mt-1 w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              <div>
                <p class="font-medium text-sm text-gray-900">{{ level.name }}</p>
                <p class="text-xs text-gray-600">{{ level.description }}</p>
              </div>
            </label>
          </div>
        </div>

        <!-- 特殊需求 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            特殊需求或限制条件
          </label>
          <textarea
            v-model="adviceData.constraints"
            rows="3"
            placeholder="请描述任何特殊需求、限制条件、资源约束或偏好..."
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          ></textarea>
        </div>

        <!-- 期望的建议风格 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            期望的建议风格
          </label>
          <div class="grid grid-cols-2 gap-3">
            <label
              v-for="style in adviceStyles"
              :key="style.id"
              class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                :value="style.id"
                v-model="selectedAdviceStyles"
                class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <div>
                <p class="font-medium text-sm text-gray-900">{{ style.name }}</p>
                <p class="text-xs text-gray-600">{{ style.description }}</p>
              </div>
            </label>
          </div>
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
            @click="getAdvice"
            :disabled="!canGetAdvice"
            :class="[
              'px-6 py-2 rounded-lg transition-colors',
              canGetAdvice
                ? 'bg-purple-500 text-white hover:bg-purple-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            获取建议
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
  getAdvice: [data: any]
}>()

// Reactive data
const adviceData = ref({
  userProfile: '',
  currentSituation: '',
  goals: '',
  priority: '',
  timeFrame: 'medium_term',
  detailLevel: 'detailed',
  constraints: ''
})

const selectedAdviceTypes = ref<string[]>(['actionable', 'strategic'])
const selectedAdviceStyles = ref<string[]>(['practical', 'encouraging'])

// 建议类型选项
const adviceTypes = [
  {
    id: 'actionable',
    name: '可执行的行动建议',
    description: '具体的步骤和行动计划'
  },
  {
    id: 'strategic',
    name: '战略性规划建议',
    description: '长期策略和方向指导'
  },
  {
    id: 'mindset',
    name: '思维方式调整',
    description: '心态和思维模式的改变'
  },
  {
    id: 'skill_development',
    name: '技能发展建议',
    description: '能力提升和学习方向'
  },
  {
    id: 'resource_recommendation',
    name: '资源推荐',
    description: '工具、书籍、课程等资源'
  },
  {
    id: 'risk_assessment',
    name: '风险评估',
    description: '潜在风险和应对策略'
  },
  {
    id: 'opportunity_identification',
    name: '机会识别',
    description: '发现和把握机会的建议'
  },
  {
    id: 'habit_formation',
    name: '习惯养成',
    description: '建立良好习惯的方法'
  }
]

// 详细程度选项
const detailLevels = [
  {
    id: 'brief',
    name: '简要建议',
    description: '核心要点和关键建议'
  },
  {
    id: 'detailed',
    name: '详细建议',
    description: '全面的分析和具体的建议'
  },
  {
    id: 'comprehensive',
    name: '综合方案',
    description: '完整的解决方案和实施计划'
  }
]

// 建议风格选项
const adviceStyles = [
  {
    id: 'practical',
    name: '实用导向',
    description: '注重可操作性和实用性'
  },
  {
    id: 'encouraging',
    name: '鼓励支持',
    description: '积极正面的鼓励和支持'
  },
  {
    id: 'analytical',
    name: '分析理性',
    description: '逻辑分析和理性思考'
  },
  {
    id: 'creative',
    name: '创新思维',
    description: '创新和非传统的解决方案'
  },
  {
    id: 'gentle',
    name: '温和耐心',
    description: '温和细致的指导方式'
  },
  {
    id: 'direct',
    name: '直接明确',
    description: '直接明了的建议风格'
  }
]

// Computed
const canGetAdvice = computed(() => {
  return adviceData.value.userProfile.trim() && 
         adviceData.value.currentSituation.trim() && 
         adviceData.value.goals.trim() &&
         selectedAdviceTypes.value.length > 0
})

// Methods
const closeModal = () => {
  emit('close')
}

const getAdvice = () => {
  if (!canGetAdvice.value) return
  
  const data = {
    ...adviceData.value,
    adviceTypes: selectedAdviceTypes.value,
    adviceStyles: selectedAdviceStyles.value
  }
  
  emit('getAdvice', data)
}
</script>
