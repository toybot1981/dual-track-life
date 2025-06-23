<template>
  <div class="ai-role-manager">
    <!-- AI角色选择器 -->
    <div class="role-selector">
      <h3>{{ $t('aiRoles.title') }}</h3>
      <div class="roles-grid">
        <div 
          v-for="role in aiServiceStore.roles" 
          :key="role.roleId"
          class="role-card"
          :class="{ 
            active: selectedRole?.roleId === role.roleId,
            primary: isPrimaryMentor(role.roleId)
          }"
          @click="selectRole(role)"
        >
          <div class="role-icon">
            <i :class="getRoleIcon(role.roleType)"></i>
          </div>
          <div class="role-info">
            <h4>{{ role.roleName }}</h4>
            <p class="role-description">{{ role.description }}</p>
            <div class="role-stats" v-if="getRoleRelationship(role.roleId)">
              <span class="relationship-level">
                {{ $t('aiRoles.level') }}: {{ getRoleRelationship(role.roleId)?.relationshipLevel || 1 }}
              </span>
              <span class="conversation-count">
                {{ getRoleRelationship(role.roleId)?.totalConversations || 0 }} {{ $t('aiRoles.conversations') }}
              </span>
            </div>
          </div>
          <div class="role-actions">
            <button 
              v-if="!isPrimaryMentor(role.roleId)"
              @click.stop="setPrimaryMentor(role.roleId)"
              class="set-primary-btn"
            >
              {{ $t('aiRoles.setPrimary') }}
            </button>
            <span v-else class="primary-badge">
              {{ $t('aiRoles.primary') }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 推荐角色 -->
    <div v-if="recommendedRole" class="recommended-role">
      <h4>{{ $t('aiRoles.recommended') }}</h4>
      <div class="recommendation-card" @click="selectRole(recommendedRole)">
        <div class="recommendation-content">
          <span class="role-name">{{ recommendedRole.roleName }}</span>
          <span class="recommendation-reason">{{ recommendationReason }}</span>
        </div>
        <button class="accept-recommendation">
          {{ $t('aiRoles.acceptRecommendation') }}
        </button>
      </div>
    </div>

    <!-- 对话界面 -->
    <div v-if="selectedRole" class="conversation-panel">
      <div class="conversation-header">
        <div class="current-role">
          <i :class="getRoleIcon(selectedRole.roleType)"></i>
          <span>{{ selectedRole.roleName }}</span>
          <span class="role-type">{{ $t(`aiRoles.types.${selectedRole.roleType}`) }}</span>
        </div>
        <div class="conversation-actions">
          <button @click="startNewConversation" class="new-conversation-btn">
            {{ $t('aiRoles.newConversation') }}
          </button>
          <button @click="switchRole" class="switch-role-btn">
            {{ $t('aiRoles.switchRole') }}
          </button>
        </div>
      </div>

      <div class="messages-container" ref="messagesContainer">
        <div v-for="message in currentMessages" :key="message.id" 
             class="message" :class="message.messageType">
          <div class="message-content">
            <div class="message-text" v-html="formatMessage(message.content)"></div>
            <div class="message-meta">
              <span class="message-time">{{ formatTime(message.createdAt) }}</span>
              <div v-if="message.messageType === 'ai'" class="message-actions">
                <button @click="rateMessage(message.id, 'helpful')" 
                        :class="{ active: message.userFeedback === 'helpful' }">
                  👍
                </button>
                <button @click="rateMessage(message.id, 'not_helpful')"
                        :class="{ active: message.userFeedback === 'not_helpful' }">
                  👎
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="aiServiceStore.isLoading" class="message ai">
          <div class="message-content">
            <div class="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </div>

      <div class="input-area">
        <div class="context-info" v-if="conversationContext">
          <span>{{ $t('aiRoles.contextInfo') }}: {{ conversationContext }}</span>
          <button @click="clearContext" class="clear-context">×</button>
        </div>
        
        <div class="input-container">
          <textarea 
            v-model="inputMessage" 
            :placeholder="getInputPlaceholder()"
            @keydown.enter.prevent="sendMessage"
            @input="handleInput"
            rows="3"
          ></textarea>
          <button 
            @click="sendMessage" 
            :disabled="!inputMessage.trim() || aiServiceStore.isLoading"
            class="send-btn"
          >
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
        
        <div class="quick-suggestions">
          <button 
            v-for="suggestion in getQuickSuggestions()" 
            :key="suggestion.key"
            @click="useSuggestion(suggestion.text)"
            class="suggestion-btn"
          >
            {{ suggestion.text }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useAIServiceStore } from '@/stores/aiService'
import { useI18n } from 'vue-i18n'
import type { AIRole, AIMessage, AIConversation } from '@/stores/aiService'

const { t } = useI18n()
const aiServiceStore = useAIServiceStore()

// 响应式数据
const selectedRole = ref<AIRole | null>(null)
const inputMessage = ref('')
const currentMessages = ref<AIMessage[]>([])
const currentConversation = ref<AIConversation | null>(null)
const conversationContext = ref<string>('')
const messagesContainer = ref<HTMLElement>()

// 计算属性
const recommendedRole = computed(() => {
  return aiServiceStore.getRecommendedRole()
})

const recommendationReason = computed(() => {
  if (!recommendedRole.value) return ''
  return t('aiRoles.recommendationReasons.general')
})

// 方法
const selectRole = async (role: AIRole) => {
  selectedRole.value = role
  await loadRoleConversations(role.roleId)
}

const isPrimaryMentor = (roleId: string): boolean => {
  const relationship = aiServiceStore.userRelationships.find(r => r.roleId === roleId)
  return relationship?.isPrimaryMentor || false
}

const setPrimaryMentor = async (roleId: string) => {
  await aiServiceStore.setPrimaryMentor(roleId)
}

const getRoleRelationship = (roleId: string) => {
  return aiServiceStore.userRelationships.find(r => r.roleId === roleId)
}

const getRoleIcon = (roleType: string): string => {
  const icons = {
    'counselor': 'fas fa-heart',
    'philosopher': 'fas fa-brain',
    'career_mentor': 'fas fa-briefcase',
    'life_coach': 'fas fa-compass',
    'life_mentor': 'fas fa-star'
  }
  return icons[roleType] || 'fas fa-user'
}

const startNewConversation = async () => {
  if (!selectedRole.value) return
  
  const conversation = await aiServiceStore.startConversation(selectedRole.value.roleId)
  currentConversation.value = conversation
  currentMessages.value = []
}

const switchRole = () => {
  selectedRole.value = null
  currentConversation.value = null
  currentMessages.value = []
}

const loadRoleConversations = async (roleId: string) => {
  const conversations = await aiServiceStore.getUserConversations(roleId)
  if (conversations.length > 0) {
    currentConversation.value = conversations[0]
    currentMessages.value = await aiServiceStore.getConversationMessages(conversations[0].id)
  } else {
    await startNewConversation()
  }
}

const sendMessage = async () => {
  if (!inputMessage.value.trim() || !selectedRole.value || !currentConversation.value) return
  
  const message = inputMessage.value.trim()
  inputMessage.value = ''
  
  // 添加用户消息
  const userMessage: AIMessage = {
    id: Date.now(),
    conversationId: currentConversation.value.id,
    userId: 1, // 临时用户ID
    roleId: selectedRole.value.roleId,
    messageType: 'user',
    content: message,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  currentMessages.value.push(userMessage)
  await scrollToBottom()
  
  // 发送到AI服务
  try {
    const response = await aiServiceStore.sendMessage(
      currentConversation.value.id,
      message,
      conversationContext.value
    )
    
    currentMessages.value.push(response)
    await scrollToBottom()
  } catch (error) {
    console.error('发送消息失败:', error)
  }
}

const rateMessage = async (messageId: number, feedback: string) => {
  await aiServiceStore.rateMessage(messageId, feedback)
  // 更新本地消息的反馈状态
  const message = currentMessages.value.find(m => m.id === messageId)
  if (message) {
    message.userFeedback = feedback
  }
}

const getInputPlaceholder = (): string => {
  if (!selectedRole.value) return t('aiRoles.inputPlaceholder.default')
  return t(`aiRoles.inputPlaceholder.${selectedRole.value.roleType}`)
}

const getQuickSuggestions = () => {
  if (!selectedRole.value) return []
  
  const suggestions = {
    'counselor': [
      { key: 'feeling', text: t('aiRoles.suggestions.counselor.feeling') },
      { key: 'stress', text: t('aiRoles.suggestions.counselor.stress') },
      { key: 'relationship', text: t('aiRoles.suggestions.counselor.relationship') }
    ],
    'philosopher': [
      { key: 'meaning', text: t('aiRoles.suggestions.philosopher.meaning') },
      { key: 'purpose', text: t('aiRoles.suggestions.philosopher.purpose') },
      { key: 'values', text: t('aiRoles.suggestions.philosopher.values') }
    ],
    'career_mentor': [
      { key: 'career', text: t('aiRoles.suggestions.career_mentor.career') },
      { key: 'skills', text: t('aiRoles.suggestions.career_mentor.skills') },
      { key: 'goals', text: t('aiRoles.suggestions.career_mentor.goals') }
    ],
    'life_coach': [
      { key: 'habits', text: t('aiRoles.suggestions.life_coach.habits') },
      { key: 'balance', text: t('aiRoles.suggestions.life_coach.balance') },
      { key: 'productivity', text: t('aiRoles.suggestions.life_coach.productivity') }
    ],
    'life_mentor': [
      { key: 'direction', text: t('aiRoles.suggestions.life_mentor.direction') },
      { key: 'decisions', text: t('aiRoles.suggestions.life_mentor.decisions') },
      { key: 'growth', text: t('aiRoles.suggestions.life_mentor.growth') }
    ]
  }
  
  return suggestions[selectedRole.value.roleType] || []
}

const useSuggestion = (suggestion: string) => {
  inputMessage.value = suggestion
}

const handleInput = () => {
  // 可以添加输入处理逻辑，如自动建议等
}

const clearContext = () => {
  conversationContext.value = ''
}

const formatMessage = (content: string): string => {
  // 格式化消息内容，支持markdown等
  return content.replace(/\n/g, '<br>')
}

const formatTime = (timestamp: string): string => {
  return new Date(timestamp).toLocaleTimeString()
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 生命周期
onMounted(async () => {
  await aiServiceStore.loadRoles()
  await aiServiceStore.loadUserRelationships()
  
  // 自动选择主要导师
  const primaryMentor = aiServiceStore.userRelationships.find(r => r.isPrimaryMentor)
  if (primaryMentor) {
    const role = aiServiceStore.roles.find(r => r.roleId === primaryMentor.roleId)
    if (role) {
      await selectRole(role)
    }
  }
})

// 监听选中角色变化
watch(selectedRole, async (newRole) => {
  if (newRole) {
    await aiServiceStore.updateRoleRelationship(newRole.roleId)
  }
})
</script>

<style scoped>
.ai-role-manager {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.role-selector {
  margin-bottom: 30px;
}

.roles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.role-card {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.role-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.role-card.active {
  border-color: #3b82f6;
  background: #eff6ff;
}

.role-card.primary {
  border-color: #f59e0b;
  background: #fffbeb;
}

.role-icon {
  font-size: 24px;
  color: #3b82f6;
  margin-bottom: 10px;
}

.role-info h4 {
  margin: 0 0 8px 0;
  color: #1f2937;
  font-size: 18px;
}

.role-description {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 12px;
  line-height: 1.4;
}

.role-stats {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #9ca3af;
}

.role-actions {
  margin-top: 15px;
}

.set-primary-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
}

.primary-badge {
  background: #f59e0b;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.recommended-role {
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.recommendation-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.conversation-panel {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  background: white;
}

.conversation-header {
  background: #f9fafb;
  padding: 15px 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.current-role {
  display: flex;
  align-items: center;
  gap: 10px;
}

.role-type {
  background: #e5e7eb;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #6b7280;
}

.conversation-actions {
  display: flex;
  gap: 10px;
}

.new-conversation-btn,
.switch-role-btn {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 12px;
}

.messages-container {
  height: 400px;
  overflow-y: auto;
  padding: 20px;
}

.message {
  margin-bottom: 15px;
}

.message.user .message-content {
  background: #3b82f6;
  color: white;
  margin-left: 20%;
  border-radius: 18px 18px 4px 18px;
}

.message.ai .message-content {
  background: #f3f4f6;
  color: #1f2937;
  margin-right: 20%;
  border-radius: 18px 18px 18px 4px;
}

.message-content {
  padding: 12px 16px;
  max-width: 80%;
}

.message-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  font-size: 11px;
  opacity: 0.7;
}

.message-actions {
  display: flex;
  gap: 5px;
}

.message-actions button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  border-radius: 3px;
}

.message-actions button.active {
  background: rgba(255, 255, 255, 0.2);
}

.typing-indicator {
  display: flex;
  gap: 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #9ca3af;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

.input-area {
  border-top: 1px solid #e5e7eb;
  padding: 15px 20px;
}

.context-info {
  background: #fef3c7;
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.clear-context {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #92400e;
}

.input-container {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.input-container textarea {
  flex: 1;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px;
  resize: none;
  font-family: inherit;
}

.send-btn {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 15px;
  cursor: pointer;
  transition: background 0.2s;
}

.send-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.quick-suggestions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.suggestion-btn {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 16px;
  padding: 4px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.suggestion-btn:hover {
  background: #e5e7eb;
}
</style>

