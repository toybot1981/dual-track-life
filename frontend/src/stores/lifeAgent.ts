import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import AIService from '@/services/aiService'

export interface LifeAgentMessage {
  id: string
  userId: string
  message: string
  type: 'user' | 'agent'
  category?: 'planning' | 'evaluation' | 'goal' | 'general'
  timestamp: number
}

export interface LifeAgentPlan {
  planId: string
  userId: string
  planType: string
  title: string
  content: string
  status: 'draft' | 'active' | 'completed'
  createdDate: number
}

export interface LifeAgentEvaluation {
  evaluationId: string
  userId: string
  evaluationType: string
  overallScore: number
  analysis: string
  recommendations: string[]
  timestamp: number
}

export const useLifeAgentStore = defineStore('lifeAgent', () => {
  // 状态
  const isConnected = ref(false)
  const isLoading = ref(false)
  const messages = ref<LifeAgentMessage[]>([])
  const plans = ref<LifeAgentPlan[]>([])
  const evaluations = ref<LifeAgentEvaluation[]>([])
  const currentUserId = ref('demo_user')
  const currentRoleId = ref('life_mentor') // 默认使用人生导师角色
  
  // 计算属性
  const latestPlan = computed(() => {
    return plans.value.length > 0 ? plans.value[plans.value.length - 1] : null
  })
  
  const latestEvaluation = computed(() => {
    return evaluations.value.length > 0 ? evaluations.value[evaluations.value.length - 1] : null
  })
  
  // 初始化Agent
  const initializeAgent = async () => {
    try {
      // 检查后端健康状态
      await AIService.healthCheck()
      isConnected.value = true
    } catch (error) {
      console.error('初始化Life Agent失败:', error)
      isConnected.value = false
    }
    
    // 无论健康检查是否成功，都添加欢迎消息
    if (messages.value.length === 0) {
      const welcomeMessage: LifeAgentMessage = {
        id: generateMessageId(),
        userId: currentUserId.value,
        message: '您好！我是您的AI生活助手，很高兴为您服务。我可以帮助您进行人生规划、目标分析和生活评估。请告诉我您想要聊什么？',
        type: 'agent',
        category: 'general',
        timestamp: Date.now()
      }
      messages.value.push(welcomeMessage)
    }
  }
  
  // 发送消息
  const sendMessage = async (messageText: string, category: string = 'general') => {
    if (!messageText.trim() || isLoading.value) return
    
    // 添加用户消息
    const userMessage: LifeAgentMessage = {
      id: generateMessageId(),
      userId: currentUserId.value,
      message: messageText,
      type: 'user',
      category: category as any,
      timestamp: Date.now()
    }
    messages.value.push(userMessage)
    
    isLoading.value = true
    
    try {
      // 流式调用AI服务
      const agentMessage: LifeAgentMessage = {
        id: generateMessageId(),
        userId: currentUserId.value,
        message: '',
        type: 'agent',
        category: category as any,
        timestamp: Date.now()
      }
      messages.value.push(agentMessage)
      await AIService.roleBasedStreamChat({
        roleId: currentRoleId.value,
        query: messageText,
        context: getConversationContext()
      }, (chunk) => {
        agentMessage.message += chunk
        messages.value = [...messages.value]
      })
    } catch (error) {
      console.error('发送消息失败:', error)
      // 添加错误消息
      const errorMessage: LifeAgentMessage = {
        id: generateMessageId(),
        userId: currentUserId.value,
        message: '抱歉，我现在无法回复您的消息。请稍后再试。',
        type: 'agent',
        category: 'general',
        timestamp: Date.now()
      }
      messages.value.push(errorMessage)
    } finally {
      isLoading.value = false
    }
  }
  
  // 切换AI角色
  const switchRole = (roleId: string) => {
    currentRoleId.value = roleId
    
    // 添加角色切换提示消息
    const switchMessage: LifeAgentMessage = {
      id: generateMessageId(),
      userId: currentUserId.value,
      message: `已切换到${getRoleName(roleId)}模式，我将以这个角色为您提供服务。`,
      type: 'agent',
      category: 'general',
      timestamp: Date.now()
    }
    messages.value.push(switchMessage)
  }
  
  // 获取对话上下文
  const getConversationContext = () => {
    const recentMessages = messages.value.slice(-5) // 获取最近5条消息作为上下文
    return recentMessages.map(msg => `${msg.type}: ${msg.message}`).join('\n')
  }
  
  // 生成消息ID
  const generateMessageId = () => {
    return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }
  
  // 获取角色名称
  const getRoleName = (roleId: string) => {
    const roleNames: Record<string, string> = {
      'life_mentor': '人生导师',
      'psychologist': '心理咨询师',
      'career_coach': '职业导师',
      'life_coach': '生活教练',
      'philosopher': '哲学家'
    }
    return roleNames[roleId] || '智能助手'
  }
  
  // 创建人生规划
  const createPlan = async (planType: string, title: string, content: string) => {
    const plan: LifeAgentPlan = {
      planId: 'plan_' + Date.now(),
      userId: currentUserId.value,
      planType,
      title,
      content,
      status: 'draft',
      createdDate: Date.now()
    }
    
    plans.value.push(plan)
    return plan
  }
  
  // 创建评估
  const createEvaluation = async (evaluationType: string, analysis: string, score: number, recommendations: string[]) => {
    const evaluation: LifeAgentEvaluation = {
      evaluationId: 'eval_' + Date.now(),
      userId: currentUserId.value,
      evaluationType,
      overallScore: score,
      analysis,
      recommendations,
      timestamp: Date.now()
    }
    
    evaluations.value.push(evaluation)
    return evaluation
  }
  
  // 清空对话
  const clearMessages = () => {
    messages.value = []
  }
  
  // 重置所有数据
  const resetAll = () => {
    messages.value = []
    plans.value = []
    evaluations.value = []
    isConnected.value = false
    isLoading.value = false
  }
  
  return {
    // 状态
    isConnected,
    isLoading,
    messages,
    plans,
    evaluations,
    currentUserId,
    currentRoleId,
    
    // 计算属性
    latestPlan,
    latestEvaluation,
    
    // 方法
    initializeAgent,
    sendMessage,
    switchRole,
    createPlan,
    createEvaluation,
    clearMessages,
    resetAll
  }
})

