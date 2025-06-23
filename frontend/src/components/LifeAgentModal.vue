<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-5/6 overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-500 to-purple-600">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-bold text-white">Life Agent AI助手</h2>
            <p class="text-blue-100 text-sm">您的智能人生伙伴</p>
          </div>
        </div>
        <button @click="closeModal" class="text-white hover:text-blue-200 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Main Content -->
      <div class="flex h-[600px]">
        <!-- Left Sidebar - AI角色和功能 -->
        <div class="w-80 bg-gray-50 border-r overflow-y-auto">
          <div class="p-4 space-y-6">
            <!-- AI角色选择 -->
            <div>
              <h3 class="font-semibold text-gray-900 mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                AI角色选择
              </h3>
              <div class="space-y-2">
                <div
                  v-for="role in availableRoles"
                  :key="role.roleId"
                  @click="selectRole(role)"
                  :class="[
                    'p-3 border rounded-lg cursor-pointer transition-all duration-200',
                    currentRole?.roleId === role.roleId
                      ? 'bg-blue-100 border-blue-300 shadow-sm'
                      : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                  ]"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium text-sm text-gray-900">{{ role.roleName }}</p>
                      <p class="text-xs text-gray-600 mt-1">{{ role.description }}</p>
                    </div>
                    <div v-if="currentRole?.roleId === role.roleId" class="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 智能功能快捷入口 -->
            <div>
              <h3 class="font-semibold text-gray-900 mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                智能功能
              </h3>
              <div class="space-y-2">
                <button
                  @click="openEventAnalysis"
                  class="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                >
                  <div class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                    <div>
                      <p class="font-medium text-sm text-gray-900">事件分析</p>
                      <p class="text-xs text-gray-600">深度分析人生事件</p>
                    </div>
                  </div>
                </button>
                
                <button
                  @click="openTrajectoryAnalysis"
                  class="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                >
                  <div class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                    <div>
                      <p class="font-medium text-sm text-gray-900">轨迹分析</p>
                      <p class="text-xs text-gray-600">人生轨迹规划预测</p>
                    </div>
                  </div>
                </button>
                
                <button
                  @click="openPersonalizedAdvice"
                  class="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                >
                  <div class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                    <div>
                      <p class="font-medium text-sm text-gray-900">个性化建议</p>
                      <p class="text-xs text-gray-600">定制化人生指导</p>
                    </div>
                  </div>
                </button>
                
                <button
                  @click="openEmotionalSupport"
                  class="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                >
                  <div class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    <div>
                      <p class="font-medium text-sm text-gray-900">情感支持</p>
                      <p class="text-xs text-gray-600">专业心理疏导</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <!-- AI状态指示器 -->
            <div class="bg-white border border-gray-200 rounded-lg p-3">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">AI状态</span>
                <div class="flex items-center space-x-2">
                  <div :class="[
                    'w-2 h-2 rounded-full',
                    aiStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
                  ]"></div>
                  <span class="text-xs text-gray-600">
                    {{ aiStatus === 'connected' ? '已连接' : '离线' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side - Chat Interface -->
        <div class="flex-1 flex flex-col">
          <!-- Chat Header -->
          <div class="flex items-center justify-between p-4 border-b bg-white">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ currentRole?.roleName || '通用助手' }}</p>
                <p class="text-sm text-gray-600">{{ currentRole?.description || '我是您的智能助手' }}</p>
              </div>
            </div>
            <button @click="clearConversation" class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>

          <!-- Chat Messages -->
          <div ref="chatContainer" class="flex-1 p-4 overflow-y-auto bg-gray-50">
            <!-- 欢迎消息 -->
            <div v-if="messages.length === 0" class="text-center py-12">
              <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">欢迎使用Life Agent</h3>
              <p class="text-gray-600 mb-4">我是您的智能人生助手，可以帮助您分析人生事件、规划未来轨迹、提供个性化建议。</p>
              <p class="text-sm text-gray-500">选择左侧的AI角色开始对话，或直接在下方输入您的问题。</p>
            </div>

            <!-- 消息列表 -->
            <div v-for="message in messages" :key="message.id" :class="[
              'flex mb-4',
              message.messageType === 'user' ? 'justify-end' : 'justify-start'
            ]">
              <div :class="[
                'max-w-3/4',
                message.messageType === 'user' ? 'order-2' : 'order-1'
              ]">
                <div v-if="message.messageType === 'user'" class="bg-blue-500 text-white p-3 rounded-lg shadow-sm">
                  <p class="whitespace-pre-wrap">{{ message.content }}</p>
                  <p class="text-xs text-blue-100 mt-1">{{ formatTime(message.timestamp) }}</p>
                </div>
                <div v-else class="bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
                  <div class="flex items-start space-x-3">
                    <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center space-x-2 mb-1">
                        <p class="font-medium text-sm text-gray-900">{{ getRoleName(message.roleId) }}</p>
                        <span class="text-xs text-gray-500">{{ formatTime(message.timestamp) }}</span>
                      </div>
                      <div class="prose prose-sm max-w-none">
                        <p class="text-gray-700 whitespace-pre-wrap">{{ message.content }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 加载指示器 -->
            <div v-if="isLoading" class="flex justify-start mb-4">
              <div class="bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p class="text-gray-600">{{ currentRole?.roleName || 'AI' }}正在思考中...</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Chat Input -->
          <div class="border-t bg-white p-4">
            <div class="flex space-x-3">
              <div class="flex-1">
                <textarea
                  v-model="currentMessage"
                  :placeholder="getInputPlaceholder()"
                  class="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  @keydown="handleKeyDown"
                  :disabled="isLoading"
                ></textarea>
              </div>
              <div class="flex flex-col space-y-2">
                <button
                  @click="sendMessage"
                  :disabled="!currentMessage.trim() || isLoading"
                  class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 功能模态框 -->
    <EventAnalysisModal
      v-if="showEventAnalysis"
      @close="showEventAnalysis = false"
      @analyze="handleEventAnalysis"
    />
    
    <TrajectoryAnalysisModal
      v-if="showTrajectoryAnalysis"
      @close="showTrajectoryAnalysis = false"
      @analyze="handleTrajectoryAnalysis"
    />
    
    <PersonalizedAdviceModal
      v-if="showPersonalizedAdvice"
      @close="showPersonalizedAdvice = false"
      @getAdvice="handlePersonalizedAdvice"
    />
    
    <EmotionalSupportModal
      v-if="showEmotionalSupport"
      @close="showEmotionalSupport = false"
      @getSupport="handleEmotionalSupport"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import AIService, { type AIRole, type AIMessage } from '@/services/aiService'
import EventAnalysisModal from './EventAnalysisModal.vue'
import TrajectoryAnalysisModal from './TrajectoryAnalysisModal.vue'
import PersonalizedAdviceModal from './PersonalizedAdviceModal.vue'
import EmotionalSupportModal from './EmotionalSupportModal.vue'

// Props
interface Props {
  isVisible: boolean
  userId: number
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
}>()

// Reactive data
const availableRoles = ref<AIRole[]>([])
const currentRole = ref<AIRole | null>(null)
const messages = ref<AIMessage[]>([])
const currentMessage = ref('')
const isLoading = ref(false)
const aiStatus = ref<'connected' | 'disconnected'>('disconnected')
const chatContainer = ref<HTMLElement>()

// Modal states
const showEventAnalysis = ref(false)
const showTrajectoryAnalysis = ref(false)
const showPersonalizedAdvice = ref(false)
const showEmotionalSupport = ref(false)

// Lifecycle
onMounted(async () => {
  await loadAIRoles()
  await checkAIStatus()
})

// Methods
const loadAIRoles = async () => {
  try {
    availableRoles.value = await AIService.getAllRoles()
    if (availableRoles.value.length > 0) {
      currentRole.value = availableRoles.value[0]
    }
  } catch (error) {
    console.error('加载AI角色失败:', error)
  }
}

const checkAIStatus = async () => {
  try {
    await AIService.healthCheck()
    aiStatus.value = 'connected'
  } catch (error) {
    aiStatus.value = 'disconnected'
  }
}

const selectRole = (role: AIRole) => {
  currentRole.value = role
  
  // 添加角色切换消息
  const roleMessage: AIMessage = {
    id: Date.now(),
    conversationId: 1,
    userId: props.userId,
    roleId: role.roleId,
    messageType: 'ai',
    content: `您好！我是${role.roleName}。${role.description}\n\n我将以${role.personality}的方式为您提供帮助。有什么我可以为您做的吗？`,
    timestamp: new Date().toISOString(),
    messageOrder: messages.value.length + 1
  }
  
  messages.value.push(roleMessage)
  scrollToBottom()
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

const sendMessage = async () => {
  if (!currentMessage.value.trim() || isLoading.value) return
  
  const userMessage: AIMessage = {
    id: Date.now(),
    conversationId: 1,
    userId: props.userId,
    roleId: currentRole.value?.roleId || 'general',
    messageType: 'user',
    content: currentMessage.value,
    timestamp: new Date().toISOString(),
    messageOrder: messages.value.length + 1
  }
  
  messages.value.push(userMessage)
  const messageContent = currentMessage.value
  currentMessage.value = ''
  
  isLoading.value = true
  scrollToBottom()
  
  try {
    let response
    if (currentRole.value && currentRole.value.roleId !== 'general') {
      response = await AIService.roleBasedChat({
        roleId: currentRole.value.roleId,
        query: messageContent,
        context: getConversationContext()
      })
    } else {
      response = await AIService.simpleChat(messageContent)
    }
    
    const aiMessage: AIMessage = {
      id: Date.now() + 1,
      conversationId: 1,
      userId: props.userId,
      roleId: currentRole.value?.roleId || 'general',
      messageType: 'ai',
      content: response.response || response,
      timestamp: new Date().toISOString(),
      messageOrder: messages.value.length + 1
    }
    
    messages.value.push(aiMessage)
    scrollToBottom()
    
  } catch (error) {
    console.error('发送消息失败:', error)
    const errorMessage: AIMessage = {
      id: Date.now() + 1,
      conversationId: 1,
      userId: props.userId,
      roleId: currentRole.value?.roleId || 'general',
      messageType: 'ai',
      content: '抱歉，我现在无法回复您的消息。请稍后再试。',
      timestamp: new Date().toISOString(),
      messageOrder: messages.value.length + 1
    }
    messages.value.push(errorMessage)
    scrollToBottom()
  } finally {
    isLoading.value = false
  }
}

const closeModal = () => {
  emit('close')
}

const clearConversation = () => {
  messages.value = []
}

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

const getRoleName = (roleId: string): string => {
  const role = availableRoles.value.find(r => r.roleId === roleId)
  return role?.roleName || '智能助手'
}

const getInputPlaceholder = (): string => {
  if (currentRole.value) {
    const examples = {
      'life_mentor': '例如：我最近在工作和生活之间感到迷茫...',
      'psychologist': '例如：我感到焦虑和压力很大...',
      'career_coach': '例如：我想转行但不知道如何开始...',
      'life_coach': '例如：我想制定一个健康的生活计划...',
      'philosopher': '例如：人生的意义是什么？'
    }
    return examples[currentRole.value.roleId as keyof typeof examples] || '输入您的问题或想法...'
  }
  return '输入您的问题或想法...'
}

const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getConversationContext = (): string => {
  const recentMessages = messages.value.slice(-5)
  return recentMessages.map(msg => 
    `${msg.messageType === 'user' ? '用户' : 'AI'}: ${msg.content}`
  ).join('\n')
}

// 功能模态框处理函数
const openEventAnalysis = () => {
  showEventAnalysis.value = true
}

const openTrajectoryAnalysis = () => {
  showTrajectoryAnalysis.value = true
}

const openPersonalizedAdvice = () => {
  showPersonalizedAdvice.value = true
}

const openEmotionalSupport = () => {
  showEmotionalSupport.value = true
}

const handleEventAnalysis = async (data: any) => {
  showEventAnalysis.value = false
  isLoading.value = true
  
  try {
    const response = await AIService.eventAnalysis(data)
    const aiMessage: AIMessage = {
      id: Date.now(),
      conversationId: 1,
      userId: props.userId,
      roleId: 'life_mentor',
      messageType: 'ai',
      content: `📊 **事件分析结果**\n\n${response.analysis}`,
      timestamp: new Date().toISOString(),
      messageOrder: messages.value.length + 1
    }
    messages.value.push(aiMessage)
    scrollToBottom()
  } catch (error) {
    console.error('事件分析失败:', error)
  } finally {
    isLoading.value = false
  }
}

const handleTrajectoryAnalysis = async (data: any) => {
  showTrajectoryAnalysis.value = false
  isLoading.value = true
  
  try {
    const response = await AIService.trajectoryAnalysis(data)
    const aiMessage: AIMessage = {
      id: Date.now(),
      conversationId: 1,
      userId: props.userId,
      roleId: 'life_mentor',
      messageType: 'ai',
      content: `🎯 **人生轨迹分析**\n\n${response.analysis}`,
      timestamp: new Date().toISOString(),
      messageOrder: messages.value.length + 1
    }
    messages.value.push(aiMessage)
    scrollToBottom()
  } catch (error) {
    console.error('轨迹分析失败:', error)
  } finally {
    isLoading.value = false
  }
}

const handlePersonalizedAdvice = async (data: any) => {
  showPersonalizedAdvice.value = false
  isLoading.value = true
  
  try {
    const response = await AIService.personalizedAdvice(data)
    const aiMessage: AIMessage = {
      id: Date.now(),
      conversationId: 1,
      userId: props.userId,
      roleId: 'life_mentor',
      messageType: 'ai',
      content: `💡 **个性化建议**\n\n${response.advice}`,
      timestamp: new Date().toISOString(),
      messageOrder: messages.value.length + 1
    }
    messages.value.push(aiMessage)
    scrollToBottom()
  } catch (error) {
    console.error('个性化建议失败:', error)
  } finally {
    isLoading.value = false
  }
}

const handleEmotionalSupport = async (data: any) => {
  showEmotionalSupport.value = false
  isLoading.value = true
  
  try {
    const response = await AIService.emotionalSupport(data)
    const aiMessage: AIMessage = {
      id: Date.now(),
      conversationId: 1,
      userId: props.userId,
      roleId: 'psychologist',
      messageType: 'ai',
      content: `❤️ **情感支持**\n\n${response.support}`,
      timestamp: new Date().toISOString(),
      messageOrder: messages.value.length + 1
    }
    messages.value.push(aiMessage)
    scrollToBottom()
  } catch (error) {
    console.error('情感支持失败:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.prose {
  max-width: none;
}

.prose p {
  margin-bottom: 0.5rem;
}

.prose p:last-child {
  margin-bottom: 0;
}
</style>
