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
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

const { t } = useI18n()
const lifeAgentStore = useLifeAgentStore()

const inputMessage = ref('')
const messagesContainer = ref<HTMLElement>()

// 配置markdown-it
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value
      } catch (err) {
        console.error('Highlight.js error:', err)
      }
    }
    return hljs.highlightAuto(code).value
  }
})

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
  try {
    // 简化预处理，专注于基本的markdown格式修正
    let processedMessage = message
      // 确保markdown标题格式正确
      .replace(/^(#{1,6})([^#\s])/gm, '$1 $2') // 确保#后有空格
      .replace(/^(#{1,6})[-]+\s*/gm, '$1 ') // 修正如'##-'为'## '
      // 标点符号不分离
      .replace(/([^\s])\s*\n\s*([？！。，；：、])/g, '$1$2')
      // 清理多余空格
      .replace(/[ \t]+/g, ' ')
      .replace(/[ \t]+$/gm, '')
      // 确保段落间有适当间距
      .replace(/\n{3,}/g, '\n\n')
    
    // 使用markdown-it解析
    const html = md.render(processedMessage)
    return html
  } catch (error) {
    console.error('Markdown parsing error:', error)
    // 简化的回退处理
    return message
      .replace(/([^\s])\s*\n\s*([？！。，；：、])/g, '$1$2')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^(#{1,6})\s*(.+)$/gm, (match, hashes, content) => {
        const level = hashes.length
        return `<h${level}>${content}</h${level}>`
      })
      .replace(/^-\s+(.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/\n/g, '<br>')
  }
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
  line-height: 1.6;
  word-wrap: break-word;
}

/* Markdown样式 */
.message-text {
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  line-height: 1.6;
  /* 防止标点符号单独成行 */
  text-align: justify;
  text-justify: inter-ideograph;
}

.message-text :deep(h1),
.message-text :deep(h2),
.message-text :deep(h3),
.message-text :deep(h4),
.message-text :deep(h5),
.message-text :deep(h6) {
  margin: 20px 0 12px 0;
  font-weight: 700;
  line-height: 1.3;
  color: #1f2937;
  /* 确保标题正确换行 */
  word-break: keep-all;
  white-space: normal;
  /* 增强标题视觉效果 */
  display: block;
  clear: both;
}

.message-text :deep(h1) { 
  font-size: 1.6em; 
  border-bottom: 3px solid #667eea; 
  padding-bottom: 10px;
  color: #1f2937;
  font-weight: 800;
  margin-top: 24px;
}
.message-text :deep(h2) { 
  font-size: 1.4em; 
  border-bottom: 2px solid #667eea; 
  padding-bottom: 8px;
  color: #374151;
  font-weight: 700;
  margin-top: 20px;
  background: linear-gradient(90deg, rgba(102, 126, 234, 0.1) 0%, transparent 100%);
  padding-left: 12px;
  border-radius: 4px;
}
.message-text :deep(h3) { 
  font-size: 1.25em; 
  color: #4b5563; 
  font-weight: 600;
  border-left: 4px solid #667eea;
  padding-left: 12px;
  margin-top: 16px;
}
.message-text :deep(h4) { 
  font-size: 1.15em; 
  color: #4b5563; 
  font-weight: 600;
  margin-top: 14px;
}
.message-text :deep(h5) { 
  font-size: 1.1em; 
  color: #6b7280; 
  font-weight: 600;
  margin-top: 12px;
}
.message-text :deep(h6) { 
  font-size: 1.05em; 
  color: #6b7280; 
  font-weight: 600;
  margin-top: 12px;
}

.message-text :deep(p) {
  margin: 12px 0;
  line-height: 1.6;
}

.message-text :deep(ul),
.message-text :deep(ol) {
  margin: 16px 0;
  padding-left: 24px;
}

.message-text :deep(li) {
  margin: 6px 0;
  line-height: 1.5;
}

.message-text :deep(ul li) {
  list-style-type: disc;
}

.message-text :deep(ol li) {
  list-style-type: decimal;
}

.message-text :deep(ul ul),
.message-text :deep(ol ol),
.message-text :deep(ul ol),
.message-text :deep(ol ul) {
  margin: 4px 0;
}

.message-text :deep(blockquote) {
  margin: 12px 0;
  padding: 8px 16px;
  border-left: 4px solid #667eea;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 4px;
  font-style: italic;
}

.message-text :deep(code) {
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9em;
}

.message-text :deep(pre) {
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  margin: 12px 0;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9em;
  line-height: 1.4;
}

.message-text :deep(pre code) {
  background: none;
  padding: 0;
  border-radius: 0;
}

.message-text :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 12px 0;
  font-size: 0.9em;
}

.message-text :deep(th),
.message-text :deep(td) {
  border: 1px solid #e0e0e0;
  padding: 8px 12px;
  text-align: left;
}

.message-text :deep(th) {
  background: #f8f9fa;
  font-weight: 600;
}

.message-text :deep(strong) {
  font-weight: 600;
  color: #333;
}

.message-text :deep(em) {
  font-style: italic;
  color: #666;
}

.message-text :deep(a) {
  color: #667eea;
  text-decoration: none;
}

.message-text :deep(a:hover) {
  text-decoration: underline;
}

.message-text :deep(hr) {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 16px 0;
}

/* 用户消息中的markdown样式调整 */
.message.user .message-text :deep(blockquote) {
  border-left-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.1);
}

.message.user .message-text :deep(code) {
  background: rgba(255, 255, 255, 0.2);
}

.message.user .message-text :deep(pre) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.message.user .message-text :deep(strong) {
  color: white;
}

.message.user .message-text :deep(em) {
  color: rgba(255, 255, 255, 0.9);
}

.message.user .message-text :deep(a) {
  color: rgba(255, 255, 255, 0.9);
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
  
  .message-text :deep(pre) {
    background: #2a2a2a;
    border-color: #444;
    color: #e0e0e0;
  }
  
  .message-text :deep(code) {
    background: rgba(255, 255, 255, 0.1);
    color: #e0e0e0;
  }
  
  .message-text :deep(blockquote) {
    background: rgba(102, 126, 234, 0.2);
    color: #e0e0e0;
  }
  
  .message-text :deep(th) {
    background: #444;
    color: #e0e0e0;
  }
  
  .message-text :deep(td) {
    border-color: #444;
    color: #e0e0e0;
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

