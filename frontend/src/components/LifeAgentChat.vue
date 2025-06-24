<template>
  <div class="life-agent-chat">
    <div class="chat-header">
      <h3>{{ $t('lifeAgent.title') }}</h3>
      <div class="connection-status" :class="{ connected: lifeAgentStore.isConnected }">
        <span class="status-dot"></span>
        {{ lifeAgentStore.isConnected ? $t('lifeAgent.connected') : $t('lifeAgent.disconnected') }}
      </div>
    </div>
    
    <div class="chat-messages" ref="messagesContainer">
      <div v-for="message in lifeAgentStore.messages" :key="message.id" 
           class="message" :class="message.type">
        <div class="message-content">
          <div class="message-text" v-html="formatMessage(message.message)"></div>
          <div class="message-time">
            {{ formatTime(message.timestamp) }}
          </div>
        </div>
      </div>
      
      <div v-if="lifeAgentStore.isLoading" class="message agent">
        <div class="message-content">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="chat-input">
      <div class="quick-actions">
        <button @click="quickAction('planning')" class="quick-btn">
          {{ $t('lifeAgent.quickActions.planning') }}
        </button>
        <button @click="quickAction('evaluation')" class="quick-btn">
          {{ $t('lifeAgent.quickActions.evaluation') }}
        </button>
        <button @click="quickAction('goal')" class="quick-btn">
          {{ $t('lifeAgent.quickActions.goal') }}
        </button>
      </div>
      
      <div class="input-area">
        <textarea 
          v-model="inputMessage" 
          :placeholder="$t('lifeAgent.inputPlaceholder')"
          @keydown.enter.prevent="sendMessage"
          @keydown.ctrl.enter="sendMessage"
          rows="2"
        ></textarea>
        <button @click="sendMessage" :disabled="!inputMessage.trim() || lifeAgentStore.isLoading">
          <i class="icon-send"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useLifeAgentStore } from '@/stores/lifeAgent'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const lifeAgentStore = useLifeAgentStore()

const inputMessage = ref('')
const messagesContainer = ref<HTMLElement>()

const sendMessage = async () => {
  if (!inputMessage.value.trim() || lifeAgentStore.isLoading) return
  
  const message = inputMessage.value.trim()
  inputMessage.value = ''
  
  try {
    await lifeAgentStore.sendMessage(message)
    scrollToBottom()
  } catch (error) {
    console.error('发送消息失败:', error)
  }
}

const quickAction = async (action: string) => {
  const messages = {
    planning: '我想制定一个人生规划',
    evaluation: '请帮我评价一下当前的人生状态',
    goal: '我想分析一下我的目标可行性'
  }
  
  inputMessage.value = messages[action as keyof typeof messages]
  await sendMessage()
}

const formatMessage = (message: string) => {
  // 简单的Markdown格式化
  return message
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
    .replace(/#{1,6}\s(.*)/g, '<h3>$1</h3>')
    .replace(/- (.*)/g, '<li>$1</li>')
}

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 监听消息变化，自动滚动到底部
watch(() => lifeAgentStore.messages.length, () => {
  scrollToBottom()
})

onMounted(async () => {
  await lifeAgentStore.initializeAgent()
})
</script>

<style scoped>
.life-agent-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  overflow: hidden;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.chat-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  opacity: 0.9;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff4757;
  animation: pulse 2s infinite;
}

.connection-status.connected .status-dot {
  background: #2ed573;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #f8f9fa;
}

.message {
  margin-bottom: 16px;
  display: flex;
}

.message.user {
  justify-content: flex-end;
}

.message.agent {
  justify-content: flex-start;
}

.message-content {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
}

.message.user .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.message.agent .message-content {
  background: white;
  color: #333;
  border: 1px solid #e0e0e0;
  border-bottom-left-radius: 4px;
}

.message-text {
  line-height: 1.5;
  word-wrap: break-word;
}

.message-time {
  font-size: 12px;
  opacity: 0.7;
  margin-top: 4px;
  text-align: right;
}

.message.agent .message-time {
  text-align: left;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  align-items: center;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #999;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.chat-input {
  border-top: 1px solid #e0e0e0;
  background: white;
}

.quick-actions {
  display: flex;
  gap: 8px;
  padding: 12px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.quick-btn {
  padding: 6px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  background: white;
  color: #666;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-btn:hover {
  background: #f8f9fa;
  border-color: #667eea;
  color: #667eea;
}

.input-area {
  display: flex;
  padding: 16px 20px;
  gap: 12px;
  align-items: flex-end;
}

.input-area textarea {
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  padding: 12px 16px;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.4;
  outline: none;
  transition: border-color 0.2s;
}

.input-area textarea:focus {
  border-color: #667eea;
}

.input-area button {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.input-area button:hover:not(:disabled) {
  transform: scale(1.05);
}

.input-area button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon-send::before {
  content: '→';
  font-size: 16px;
  font-weight: bold;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .life-agent-chat {
    background: #1a1a1a;
    border-color: #333;
  }
  
  .chat-messages {
    background: #2a2a2a;
  }
  
  .message.agent .message-content {
    background: #333;
    color: #e0e0e0;
    border-color: #444;
  }
  
  .chat-input {
    background: #1a1a1a;
    border-color: #333;
  }
  
  .input-area textarea {
    background: #333;
    color: #e0e0e0;
    border-color: #444;
  }
  
  .quick-btn {
    background: #333;
    color: #e0e0e0;
    border-color: #444;
  }
}
</style>

