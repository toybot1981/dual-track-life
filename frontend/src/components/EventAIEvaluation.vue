<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
      <!-- 头部 -->
      <div class="flex items-center justify-between p-6 border-b">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">{{ $t('ai.eventEvaluation.title') }}</h2>
          <p class="text-sm text-gray-600 mt-1">{{ event?.title }}</p>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 内容区域 -->
      <div class="flex h-[calc(90vh-80px)]">
        <!-- 左侧：评价结果 -->
        <div class="flex-1 p-6 overflow-y-auto border-r">
          <div v-if="aiStore.isLoading" class="flex items-center justify-center h-64">
            <div class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p class="mt-4 text-gray-600">{{ $t('ai.analyzing') }}</p>
            </div>
          </div>

          <div v-else-if="evaluation" class="space-y-6">
            <!-- 总体评分 -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('ai.eventEvaluation.overallAnalysis') }}</h3>
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center">
                  <div class="text-3xl font-bold text-blue-600">{{ evaluation.analysis.overallScore }}</div>
                  <div class="text-sm text-gray-600">{{ $t('ai.eventEvaluation.overallScore') }}</div>
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">{{ $t('ai.eventEvaluation.emotionalImpact') }}</span>
                    <span class="text-sm font-medium text-green-600">{{ evaluation.analysis.emotionalImpact }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">{{ $t('ai.eventEvaluation.growthPotential') }}</span>
                    <span class="text-sm font-medium text-blue-600">{{ evaluation.analysis.growthPotential }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">{{ $t('ai.eventEvaluation.lifeSignificance') }}</span>
                    <span class="text-sm font-medium text-purple-600">{{ evaluation.analysis.lifeSignificance }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 洞察分析 -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ $t('ai.eventEvaluation.insights') }}</h3>
              
              <!-- 优势 -->
              <div class="bg-green-50 rounded-lg p-4">
                <h4 class="font-medium text-green-800 mb-2">{{ $t('ai.eventEvaluation.strengths') }}</h4>
                <ul class="space-y-1">
                  <li v-for="strength in evaluation.insights.strengths" :key="strength" 
                      class="text-sm text-green-700 flex items-start">
                    <span class="text-green-500 mr-2">•</span>
                    {{ strength }}
                  </li>
                </ul>
              </div>

              <!-- 改进建议 -->
              <div class="bg-yellow-50 rounded-lg p-4">
                <h4 class="font-medium text-yellow-800 mb-2">{{ $t('ai.eventEvaluation.improvements') }}</h4>
                <ul class="space-y-1">
                  <li v-for="improvement in evaluation.insights.improvements" :key="improvement" 
                      class="text-sm text-yellow-700 flex items-start">
                    <span class="text-yellow-500 mr-2">•</span>
                    {{ improvement }}
                  </li>
                </ul>
              </div>

              <!-- 未来机会 -->
              <div class="bg-blue-50 rounded-lg p-4">
                <h4 class="font-medium text-blue-800 mb-2">{{ $t('ai.eventEvaluation.futureOpportunities') }}</h4>
                <ul class="space-y-1">
                  <li v-for="opportunity in evaluation.insights.futureOpportunities" :key="opportunity" 
                      class="text-sm text-blue-700 flex items-start">
                    <span class="text-blue-500 mr-2">•</span>
                    {{ opportunity }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- 行动建议 -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ $t('ai.eventEvaluation.recommendations') }}</h3>
              
              <div class="grid gap-4">
                <!-- 即时行动 -->
                <div class="border rounded-lg p-4">
                  <h4 class="font-medium text-gray-800 mb-2">{{ $t('ai.eventEvaluation.immediate') }}</h4>
                  <ul class="space-y-1">
                    <li v-for="action in evaluation.recommendations.immediate" :key="action" 
                        class="text-sm text-gray-600 flex items-start">
                      <span class="text-gray-400 mr-2">→</span>
                      {{ action }}
                    </li>
                  </ul>
                </div>

                <!-- 短期规划 -->
                <div class="border rounded-lg p-4">
                  <h4 class="font-medium text-gray-800 mb-2">{{ $t('ai.eventEvaluation.shortTerm') }}</h4>
                  <ul class="space-y-1">
                    <li v-for="action in evaluation.recommendations.shortTerm" :key="action" 
                        class="text-sm text-gray-600 flex items-start">
                      <span class="text-gray-400 mr-2">→</span>
                      {{ action }}
                    </li>
                  </ul>
                </div>

                <!-- 长期发展 -->
                <div class="border rounded-lg p-4">
                  <h4 class="font-medium text-gray-800 mb-2">{{ $t('ai.eventEvaluation.longTerm') }}</h4>
                  <ul class="space-y-1">
                    <li v-for="action in evaluation.recommendations.longTerm" :key="action" 
                        class="text-sm text-gray-600 flex items-start">
                      <span class="text-gray-400 mr-2">→</span>
                      {{ action }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="flex items-center justify-center h-64">
            <div class="text-center">
              <p class="text-gray-600 mb-4">{{ $t('ai.eventEvaluation.noEvaluation') }}</p>
              <button @click="startEvaluation" 
                      class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                {{ $t('ai.eventEvaluation.startEvaluation') }}
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧：AI对话 -->
        <div class="w-96 flex flex-col">
          <!-- 对话标题 -->
          <div class="p-4 border-b">
            <h3 class="font-medium text-gray-900">{{ $t('ai.chat.title') }}</h3>
            <p class="text-sm text-gray-600">{{ $t('ai.chat.eventContext') }}</p>
          </div>

          <!-- 对话历史 -->
          <div class="flex-1 overflow-y-auto p-4 space-y-4">
            <div v-for="message in eventChatHistory" :key="message.messageId" 
                 :class="['flex', message.type === 'user' ? 'justify-end' : 'justify-start']">
              <div :class="[
                'max-w-[80%] rounded-lg px-3 py-2 text-sm',
                message.type === 'user' 
                  ? 'bg-blue-600 text-white' 
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
                     class="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <button @click="sendMessage" 
                      :disabled="!chatInput.trim() || aiStore.isLoading"
                      class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
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
import { useAIStore } from '@/stores/aiService'

import type { Event } from '@/stores/events'

interface Props {
  event: Event
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const aiStore = useAIStore()
const chatInput = ref('')

const evaluation = computed(() => aiStore.getEventEvaluation(props.event.id?.toString() || ''))
const eventChatHistory = computed(() => aiStore.getChatHistory({ eventId: props.event.id?.toString() || '' }))
const lastAIMessage = computed(() => {
  const messages = eventChatHistory.value.filter(m => m.type === 'ai')
  return messages[messages.length - 1]
})

const startEvaluation = async () => {
  await aiStore.evaluateEvent(props.event.id?.toString() || '', {
    title: props.event.title,
    description: props.event.description || '',
    category: props.event.category,
    impact: props.event.impact || 'medium'
  })
}

const sendMessage = async () => {
  if (!chatInput.value.trim()) return
  
  const message = chatInput.value
  chatInput.value = ''
  
  await aiStore.sendMessage(message, { eventId: props.event.id?.toString() || '' })
}

const sendSuggestion = async (suggestion: string) => {
  await aiStore.sendMessage(suggestion, { eventId: props.event.id?.toString() || '' })
}

onMounted(() => {
  // 如果还没有评价，自动开始评价
  if (!evaluation.value) {
    startEvaluation()
  }
})
</script>

