import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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
  const currentUserId = ref('user_' + Date.now())
  
  // Life Agent API 基础URL
  const API_BASE_URL = 'https://8080-ila6aaotdfwudti5rzegi-cb0adbf3.manusvm.computer/api'
  
  // 计算属性
  const latestPlan = computed(() => {
    return plans.value.length > 0 ? plans.value[plans.value.length - 1] : null
  })
  
  const latestEvaluation = computed(() => {
    return evaluations.value.length > 0 ? evaluations.value[evaluations.value.length - 1] : null
  })
  
  const conversationHistory = computed(() => {
    return messages.value.slice(-10) // 最近10条消息
  })
  
  // 方法
  const checkHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`)
      const data = await response.json()
      isConnected.value = data.status === 'UP'
      return data
    } catch (error) {
      console.error('Life Agent健康检查失败:', error)
      isConnected.value = false
      throw error
    }
  }
  
  const sendMessage = async (message: string, type: string = 'general') => {
    isLoading.value = true
    
    // 添加用户消息
    const userMessage: LifeAgentMessage = {
      id: 'msg_' + Date.now(),
      userId: currentUserId.value,
      message,
      type: 'user',
      timestamp: Date.now()
    }
    messages.value.push(userMessage)
    
    try {
      const response = await fetch(`${API_BASE_URL}/life-agent/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId.value,
          message,
          type
        })
      })
      
      const data = await response.json()
      
      // 添加AI回复
      const agentMessage: LifeAgentMessage = {
        id: 'msg_' + Date.now() + '_agent',
        userId: currentUserId.value,
        message: data.message,
        type: 'agent',
        category: data.category,
        timestamp: data.timestamp
      }
      messages.value.push(agentMessage)
      
      return data
    } catch (error) {
      console.error('发送消息失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }
  
  const generatePlanning = async (planType: string = '综合规划', requirements: string = '') => {
    isLoading.value = true
    
    try {
      const response = await fetch(`${API_BASE_URL}/life-agent/planning`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId.value,
          planType,
          requirements
        })
      })
      
      const data = await response.json()
      
      // 保存规划
      const plan: LifeAgentPlan = {
        planId: data.planId,
        userId: data.userId,
        planType: data.planType,
        title: data.title,
        content: data.content,
        status: data.status,
        createdDate: data.createdDate
      }
      plans.value.push(plan)
      
      return data
    } catch (error) {
      console.error('生成规划失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }
  
  const performEvaluation = async (evaluationType: string = 'comprehensive') => {
    isLoading.value = true
    
    try {
      const response = await fetch(`${API_BASE_URL}/life-agent/evaluation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId.value,
          evaluationType
        })
      })
      
      const data = await response.json()
      
      // 保存评价
      const evaluation: LifeAgentEvaluation = {
        evaluationId: data.evaluationId,
        userId: data.userId,
        evaluationType: data.evaluationType,
        overallScore: data.overallScore,
        analysis: data.analysis,
        recommendations: data.recommendations,
        timestamp: data.timestamp
      }
      evaluations.value.push(evaluation)
      
      return data
    } catch (error) {
      console.error('执行评价失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }
  
  const getUserProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/life-agent/user/${currentUserId.value}/profile`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error('获取用户档案失败:', error)
      throw error
    }
  }
  
  const clearHistory = () => {
    messages.value = []
    plans.value = []
    evaluations.value = []
  }
  
  const initializeAgent = async () => {
    try {
      await checkHealth()
      console.log('Life Agent初始化成功')
    } catch (error) {
      console.error('Life Agent初始化失败:', error)
    }
  }
  
  return {
    // 状态
    isConnected,
    isLoading,
    messages,
    plans,
    evaluations,
    currentUserId,
    
    // 计算属性
    latestPlan,
    latestEvaluation,
    conversationHistory,
    
    // 方法
    checkHealth,
    sendMessage,
    generatePlanning,
    performEvaluation,
    getUserProfile,
    clearHistory,
    initializeAgent
  }
})

