<template>
  <div class="chat-interface flex flex-col h-full">
    <!-- 对话历史 -->
    <div class="flex-1 p-4 overflow-y-auto bg-gray-50" ref="chatContainer">
      <div class="space-y-4">
        <!-- 欢迎消息 -->
        <div v-if="messages.length === 0" class="text-center py-8">
          <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">欢迎使用Life Agent</h3>
          <p class="text-gray-600 mb-4">我是您的智能人生助手 - {{ currentRole?.roleName || '通用助手' }}</p>
          <p class="text-sm text-gray-500">{{ currentRole?.description || '我可以帮助您分析人生事件、规划未来轨迹、提供个性化建议。' }}</p>
        </div>

        <!-- 对话消息 -->
        <div v-for="message in messages" :key="message.id" class="flex" :class="message.messageType === 'user' ? 'justify-end' : 'justify-start'">
          <div class="max-w-3/4">
            <!-- 用户消息 -->
            <div v-if="message.messageType === 'user'" class="bg-blue-500 text-white p-3 rounded-lg">
              <p class="whitespace-pre-wrap">{{ message.content }}</p>
              <p class="text-xs text-blue-100 mt-1">{{ formatTime(message.timestamp) }}</p>
            </div>
            
            <!-- AI消息 -->
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
        <div v-if="isLoading" class="flex justify-start">
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
    </div>

    <!-- 输入区域 -->
    <div class="border-t bg-white p-4">
      <div class="flex space-x-3">
        <div class="flex-1">
          <textarea
            v-model="currentMessage"
            @keydown.enter.prevent="sendMessage"
            :placeholder="getInputPlaceholder()"
            class="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
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
          <button
            @click="clearConversation"
            class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            title="清空对话"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { AIService, type AIRole, type AIMessage } from '@/services/aiService'

interface Props {
  currentRole: AIRole | null
  userId: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  roleSwitch: [roleId: string]
}>()

const currentMessage = ref('')
const messages = ref<AIMessage[]>([])
const isLoading = ref(false)
const chatContainer = ref<HTMLElement>()

// 监听角色变化
watch(() => props.currentRole, (newRole, oldRole) => {
  if (newRole && oldRole && newRole.roleId !== oldRole.roleId) {
    handleRoleSwitch(newRole)
  }
}, { deep: true })

// 监听消息变化，自动滚动到底部
watch(messages, () => {
  nextTick(() => {
    scrollToBottom()
  })
}, { deep: true })

const handleRoleSwitch = (newRole: AIRole) => {
  // 添加角色切换消息
  const switchMessage: AIMessage = {
    id: Date.now(),
    conversationId: 0,
    userId: props.userId,
    roleId: newRole.roleId,
    messageType: 'ai',
    content: `您好！我是${newRole.roleName}。${newRole.description}\n\n我将以${newRole.personality}的方式为您提供帮助。有什么我可以为您做的吗？`,
    timestamp: new Date().toISOString(),
    messageOrder: messages.value.length + 1
  }
  
  messages.value.push(switchMessage)
}

const sendMessage = async () => {
  if (!currentMessage.value.trim() || isLoading.value) return
  
  const userMessage = currentMessage.value.trim()
  currentMessage.value = ''
  
  // 添加用户消息
  const userMsg: AIMessage = {
    id: Date.now(),
    conversationId: 0,
    userId: props.userId,
    roleId: props.currentRole?.roleId || 'general',
    messageType: 'user',
    content: userMessage,
    timestamp: new Date().toISOString(),
    messageOrder: messages.value.length + 1
  }
  
  messages.value.push(userMsg)
  isLoading.value = true
  
  try {
    let aiResponse
    if (props.currentRole) {
      const response = await AIService.roleBasedChat(
        props.currentRole.roleId,
        userMessage,
        getConversationContext()
      )
      aiResponse = response.response
    } else {
      const response = await AIService.simpleChat(userMessage)
      aiResponse = response.response
    }
    
    // 添加AI回复消息
    const aiMsg: AIMessage = {
      id: Date.now() + 1,
      conversationId: 0,
      userId: props.userId,
      roleId: props.currentRole?.roleId || 'general',
      messageType: 'ai',
      content: aiResponse,
      timestamp: new Date().toISOString(),
      messageOrder: messages.value.length + 1
    }
    
    messages.value.push(aiMsg)
    
    // 更新统计
    updateChatStatistics()
  } catch (error) {
    console.error('发送消息失败:', error)
    
    // 添加错误消息
    const errorMsg: AIMessage = {
      id: Date.now() + 1,
      conversationId: 0,
      userId: props.userId,
      roleId: props.currentRole?.roleId || 'general',
      messageType: 'ai',
      content: '抱歉，我现在无法回复您的消息。请稍后再试。',
      timestamp: new Date().toISOString(),
      messageOrder: messages.value.length + 1
    }
    
    messages.value.push(errorMsg)
  } finally {
    isLoading.value = false
  }
}

const getConversationContext = (): string => {
  const recentMessages = messages.value.slice(-5)
  return recentMessages.map(msg => `${msg.messageType === 'user' ? '用户' : 'AI'}: ${msg.content}`).join('\n')
}

const clearConversation = () => {
  messages.value = []
}

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const getRoleName = (roleId: string): string => {
  return props.currentRole?.roleName || '智能助手'
}

const getInputPlaceholder = (): string => {
  if (props.currentRole) {
    const examples = {
      'life_mentor': '例如：我最近在工作和生活之间感到迷茫...',
      'psychologist': '例如：我感到焦虑和压力很大...',
      'career_coach': '例如：我想转行但不知道如何开始...',
      'life_coach': '例如：我想制定一个健康的生活计划...',
      'philosopher': '例如：人生的意义是什么？'
    }
    return examples[props.currentRole.roleId as keyof typeof examples] || '输入您的问题或想法...'
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

const updateChatStatistics = () => {
  const today = new Date().toDateString()
  const lastChatDate = localStorage.getItem('lastChatDate')
  
  if (lastChatDate !== today) {
    localStorage.setItem('todayChats', '1')
    localStorage.setItem('lastChatDate', today)
  } else {
    const todayChats = parseInt(localStorage.getItem('todayChats') || '0') + 1
    localStorage.setItem('todayChats', todayChats.toString())
  }
  
  const totalChats = parseInt(localStorage.getItem('totalChats') || '0') + 1
  localStorage.setItem('totalChats', totalChats.toString())
}
</script>

<style scoped>
.chat-interface {
  height: 600px;
}

.prose p {
  margin: 0;
}
</style>

