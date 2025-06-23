<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden">
      <!-- 头部 -->
      <div class="flex items-center justify-between p-6 border-b">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">{{ $t('ai.planAnalysis.title') }}</h2>
          <p class="text-sm text-gray-600 mt-1">{{ plan?.title || $t('ai.planAnalysis.subtitle') }}</p>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 内容区域 -->
      <div class="flex h-[calc(90vh-80px)]">
        <!-- 左侧：分析结果 -->
        <div class="flex-1 p-6 overflow-y-auto border-r">
          <div v-if="aiStore.isLoading" class="flex items-center justify-center h-64">
            <div class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p class="mt-4 text-gray-600">{{ $t('ai.analyzing') }}</p>
            </div>
          </div>

          <div v-else-if="analysis" class="space-y-6">
            <!-- 可行性评估 -->
            <div class="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('ai.planAnalysis.feasibilityAssessment') }}</h3>
              
              <!-- 总体评分 -->
              <div class="text-center mb-6">
                <div class="text-4xl font-bold text-purple-600">{{ analysis.feasibility.overallScore }}</div>
                <div class="text-sm text-gray-600">{{ $t('ai.planAnalysis.overallScore') }}</div>
              </div>

              <!-- 详细评分 -->
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">{{ $t('ai.planAnalysis.timeRealistic') }}</span>
                    <div class="flex items-center">
                      <div class="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div class="bg-green-500 h-2 rounded-full" :style="`width: ${analysis.feasibility.timeRealistic * 10}%`"></div>
                      </div>
                      <span class="text-sm font-medium">{{ analysis.feasibility.timeRealistic }}</span>
                    </div>
                  </div>
                  
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">{{ $t('ai.planAnalysis.resourceAvailability') }}</span>
                    <div class="flex items-center">
                      <div class="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div class="bg-blue-500 h-2 rounded-full" :style="`width: ${analysis.feasibility.resourceAvailability * 10}%`"></div>
                      </div>
                      <span class="text-sm font-medium">{{ analysis.feasibility.resourceAvailability }}</span>
                    </div>
                  </div>
                </div>

                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">{{ $t('ai.planAnalysis.skillRequirement') }}</span>
                    <div class="flex items-center">
                      <div class="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div class="bg-yellow-500 h-2 rounded-full" :style="`width: ${analysis.feasibility.skillRequirement * 10}%`"></div>
                      </div>
                      <span class="text-sm font-medium">{{ analysis.feasibility.skillRequirement }}</span>
                    </div>
                  </div>
                  
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">{{ $t('ai.planAnalysis.marketOpportunity') }}</span>
                    <div class="flex items-center">
                      <div class="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div class="bg-purple-500 h-2 rounded-full" :style="`width: ${analysis.feasibility.marketOpportunity * 10}%`"></div>
                      </div>
                      <span class="text-sm font-medium">{{ analysis.feasibility.marketOpportunity }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 风险评估 -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ $t('ai.planAnalysis.riskAssessment') }}</h3>
              
              <div class="bg-red-50 rounded-lg p-4">
                <div class="flex items-center mb-3">
                  <span class="text-red-600 font-medium">{{ $t('ai.planAnalysis.riskLevel') }}: </span>
                  <span class="ml-2 px-2 py-1 bg-red-100 text-red-800 rounded text-sm">{{ analysis.riskAssessment.level }}</span>
                </div>
                
                <div class="space-y-3">
                  <div>
                    <h4 class="font-medium text-red-800 mb-2">{{ $t('ai.planAnalysis.mainRisks') }}</h4>
                    <ul class="space-y-1">
                      <li v-for="risk in analysis.riskAssessment.mainRisks" :key="risk" 
                          class="text-sm text-red-700 flex items-start">
                        <span class="text-red-500 mr-2">⚠</span>
                        {{ risk }}
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 class="font-medium text-red-800 mb-2">{{ $t('ai.planAnalysis.mitigationStrategies') }}</h4>
                    <ul class="space-y-1">
                      <li v-for="strategy in analysis.riskAssessment.mitigationStrategies" :key="strategy" 
                          class="text-sm text-red-700 flex items-start">
                        <span class="text-red-500 mr-2">🛡</span>
                        {{ strategy }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- 优化建议 -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ $t('ai.planAnalysis.optimization') }}</h3>
              
              <div class="grid gap-4">
                <!-- 优先级调整 -->
                <div class="border rounded-lg p-4">
                  <h4 class="font-medium text-gray-800 mb-2 flex items-center">
                    <span class="text-blue-500 mr-2">🎯</span>
                    {{ $t('ai.planAnalysis.priorityAdjustments') }}
                  </h4>
                  <ul class="space-y-1">
                    <li v-for="adjustment in analysis.optimization.priorityAdjustments" :key="adjustment" 
                        class="text-sm text-gray-600 flex items-start">
                      <span class="text-gray-400 mr-2">→</span>
                      {{ adjustment }}
                    </li>
                  </ul>
                </div>

                <!-- 时间线优化 -->
                <div class="border rounded-lg p-4">
                  <h4 class="font-medium text-gray-800 mb-2 flex items-center">
                    <span class="text-green-500 mr-2">⏰</span>
                    {{ $t('ai.planAnalysis.timelineOptimization') }}
                  </h4>
                  <ul class="space-y-1">
                    <li v-for="timeline in analysis.optimization.timelineOptimization" :key="timeline" 
                        class="text-sm text-gray-600 flex items-start">
                      <span class="text-gray-400 mr-2">→</span>
                      {{ timeline }}
                    </li>
                  </ul>
                </div>

                <!-- 资源优化 -->
                <div class="border rounded-lg p-4">
                  <h4 class="font-medium text-gray-800 mb-2 flex items-center">
                    <span class="text-purple-500 mr-2">💎</span>
                    {{ $t('ai.planAnalysis.resourceOptimization') }}
                  </h4>
                  <ul class="space-y-1">
                    <li v-for="resource in analysis.optimization.resourceOptimization" :key="resource" 
                        class="text-sm text-gray-600 flex items-start">
                      <span class="text-gray-400 mr-2">→</span>
                      {{ resource }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="flex items-center justify-center h-64">
            <div class="text-center">
              <p class="text-gray-600 mb-4">{{ $t('ai.planAnalysis.noAnalysis') }}</p>
              <button @click="startAnalysis" 
                      class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                {{ $t('ai.planAnalysis.startAnalysis') }}
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧：AI对话 -->
        <div class="w-96 flex flex-col">
          <!-- 对话标题 -->
          <div class="p-4 border-b">
            <h3 class="font-medium text-gray-900">{{ $t('ai.chat.title') }}</h3>
            <p class="text-sm text-gray-600">{{ $t('ai.chat.planContext') }}</p>
          </div>

          <!-- 对话历史 -->
          <div class="flex-1 overflow-y-auto p-4 space-y-4">
            <div v-for="message in planChatHistory" :key="message.messageId" 
                 :class="['flex', message.type === 'user' ? 'justify-end' : 'justify-start']">
              <div :class="[
                'max-w-[80%] rounded-lg px-3 py-2 text-sm',
                message.type === 'user' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-900'
              ]">
                {{ message.message }}
              </div>
            </div>

            <!-- AI建议 -->
            <div v-if="lastAIMessage?.suggestions" class="space-y-2">
              <p class="text-xs text-gray-500">{{ $t('ai.chat.suggestions') }}</p>
              <div class="space-y-1">
                <button v-for="suggestion in lastAIMessage.suggestions" :key="suggestion"
                        @click="sendSuggestion(suggestion)"
                        class="block w-full text-left text-xs bg-gray-50 hover:bg-gray-100 rounded px-2 py-1 text-gray-700">
                  {{ suggestion }}
                </button>
              </div>
            </div>

            <div v-if="aiStore.isLoading" class="flex justify-start">
              <div class="bg-gray-100 rounded-lg px-3 py-2">
                <div class="flex space-x-1">
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 输入框 -->
          <div class="p-4 border-t">
            <div class="flex space-x-2">
              <input v-model="chatInput" 
                     @keyup.enter="sendMessage"
                     :placeholder="$t('ai.chat.placeholder')"
                     class="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
              <button @click="sendMessage" 
                      :disabled="!chatInput.trim() || aiStore.isLoading"
                      class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAIServiceStore } from '@/stores/aiService'

interface Plan {
  id: string
  title: string
  description: string
  goals: string[]
  timeline: string
}

interface Props {
  plan: Plan
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const aiStore = useAIServiceStore()
const chatInput = ref('')

const analysis = computed(() => aiStore.getPlanAnalysis(props.plan.id))
const planChatHistory = computed(() => aiStore.getChatHistory({ planId: props.plan.id }))
const lastAIMessage = computed(() => {
  const messages = planChatHistory.value.filter(m => m.type === 'ai')
  return messages[messages.length - 1]
})

const startAnalysis = async () => {
  await aiStore.analyzePlan(props.plan.id, {
    title: props.plan.title,
    description: props.plan.description,
    goals: props.plan.goals,
    timeline: props.plan.timeline
  })
}
  
const sendMessage = async () => {
  if (!chatInput.value.trim()) return
  
  const message = chatInput.value.trim()
  chatInput.value = ''
  
  // 需要先获取或创建对话ID
  const conversationId = 1 // 临时使用固定ID
  const userId = 1 // 临时用户ID
  
  await aiStore.sendMessage(conversationId, userId, message)
}

const sendSuggestion = async (suggestion: string) => {
  // 需要先获取或创建对话ID
  const conversationId = 1 // 临时使用固定ID
  const userId = 1 // 临时用户ID
  
  await aiStore.sendMessage(conversationId, userId, suggestion)
}

onMounted(() => {
  // 如果还没有分析，自动开始分析
  if (!analysis.value) {
    startAnalysis()
  }
})
</script>

