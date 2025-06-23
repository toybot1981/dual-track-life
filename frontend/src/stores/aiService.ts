import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'

// AI角色接口定义
export interface AIRole {
  roleId: string
  roleName: string
  roleType: string
  description: string
  expertise: string[]
  personality: string[]
  isActive: boolean
}

// 用户与AI角色关系接口
export interface UserAIRelationship {
  userId: number
  roleId: string
  relationshipLevel: number
  totalConversations: number
  lastConversationAt: string
  satisfactionScore: number
  isPrimaryMentor: boolean
}

// AI对话会话接口
export interface AIConversation {
  id: number
  userId: number
  roleId: string
  sessionTitle: string
  conversationType: string
  relatedEventId?: number
  relatedGoalId?: number
  status: string
  summary?: string
  keyInsights?: string
  satisfactionRating?: number
  startedAt: string
  lastActiveAt: string
  endedAt?: string
}

// AI消息接口
export interface AIMessage {
  id: number
  conversationId: number
  userId: number
  roleId: string
  messageType: 'user' | 'ai' | 'system'
  content: string
  contextInfo?: string
  confidence?: number
  emotionalAnalysis?: string
  userFeedback?: string
  messageOrder: number
  isKeyMessage: boolean
  createdAt: string
}

// 人生事件接口
export interface LifeEvent {
  id?: number
  userId: number
  title: string
  description: string
  eventType: string
  eventDate: string
  emotionalState?: string
  emotionalIntensity?: number
  importanceLevel?: number
  isMilestone: boolean
  tags?: string
  lifeDomains?: string
  impactTimeframe?: string
  recommendedRoles?: string
  status: string
}

// 人生轨迹概览接口
export interface LifeTrajectoryOverview {
  userId: number
  totalEvents: number
  milestoneEvents: number
  recentEvents: LifeEvent[]
  lifeDomainDistribution: Record<string, number>
  emotionalTrend: EmotionalTrend
  growthInsights: string[]
}

// 情感趋势接口
export interface EmotionalTrend {
  overallTrend: string
  averageIntensity: number
  emotionalDistribution: Record<string, number>
}

// 对话统计接口
export interface ConversationStats {
  totalConversations: number
  totalMessages: number
  activeConversations: number
  roleInteractionStats: Record<string, number>
  averageSessionDuration: number
}

// 保持原有的评价和分析接口
export interface AIEvaluation {
  eventId: string
  evaluationId: string
  timestamp: string
  status: string
  analysis: {
    overallScore: number
    emotionalImpact: string
    growthPotential: string
    lifeSignificance: string
  }
  insights: {
    strengths: string[]
    improvements: string[]
    futureOpportunities: string[]
  }
  recommendations: {
    immediate: string[]
    shortTerm: string[]
    longTerm: string[]
  }
}

export interface PlanAnalysis {
  planId: string
  analysisId: string
  timestamp: string
  status: string
  feasibility: {
    overallScore: number
    timeRealistic: number
    resourceAvailability: number
    skillRequirement: number
    marketOpportunity: number
  }
  riskAssessment: {
    level: string
    mainRisks: string[]
    mitigationStrategies: string[]
  }
  optimization: {
    priorityAdjustments: string[]
    timelineOptimization: string[]
    resourceOptimization: string[]
  }
}

export const useAIServiceStore = defineStore('aiService', () => {
  // 状态管理
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // AI角色相关状态
  const availableRoles = ref<AIRole[]>([])
  const currentRole = ref<AIRole | null>(null)
  const userRoleRelationships = ref<Record<string, UserAIRelationship>>({})
  const primaryMentor = ref<string>('life_mentor')
  
  // 对话相关状态
  const activeConversations = ref<AIConversation[]>([])
  const currentConversation = ref<AIConversation | null>(null)
  const conversationHistory = ref<AIMessage[]>([])
  const conversationStats = ref<ConversationStats | null>(null)
  
  // 人生轨迹相关状态
  const userEvents = ref<LifeEvent[]>([])
  const trajectoryOverview = ref<LifeTrajectoryOverview | null>(null)
  
  // 原有的评价和分析状态
  const evaluations = reactive<Record<string, AIEvaluation>>({})
  const planAnalyses = reactive<Record<string, PlanAnalysis>>({})

  // API基础URL
  const API_BASE = '/api/life-agent'

  // ==================== AI角色管理方法 ====================
  
  /**
   * 获取所有可用的AI角色
   */
  const fetchAvailableRoles = async () => {
    try {
      isLoading.value = true
      const response = await fetch(`${API_BASE}/roles`)
      if (!response.ok) throw new Error('获取AI角色失败')
      
      const roles = await response.json()
      availableRoles.value = roles
      return roles
    } catch (err) {
      error.value = err instanceof Error ? err.message : '未知错误'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 获取特定AI角色信息
   */
  const fetchRoleInfo = async (roleId: string) => {
    try {
      const response = await fetch(`${API_BASE}/roles/${roleId}`)
      if (!response.ok) throw new Error('获取角色信息失败')
      
      const role = await response.json()
      return role
    } catch (err) {
      error.value = err instanceof Error ? err.message : '未知错误'
      throw err
    }
  }

  /**
   * 设置主要AI导师
   */
  const setPrimaryMentor = async (userId: number, roleId: string) => {
    try {
      isLoading.value = true
      const response = await fetch(`${API_BASE}/users/${userId}/primary-mentor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId })
      })
      
      if (!response.ok) throw new Error('设置主要导师失败')
      
      primaryMentor.value = roleId
      return await response.json()
    } catch (err) {
      error.value = err instanceof Error ? err.message : '未知错误'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 获取用户与AI角色的关系
   */
  const fetchUserRoleRelationship = async (userId: number, roleId: string) => {
    try {
      const response = await fetch(`${API_BASE}/users/${userId}/roles/${roleId}/relationship`)
      if (!response.ok) throw new Error('获取角色关系失败')
      
      const relationship = await response.json()
      userRoleRelationships.value[roleId] = relationship
      return relationship
    } catch (err) {
      error.value = err instanceof Error ? err.message : '未知错误'
      throw err
    }
  }

  // ==================== 对话管理方法 ====================

  /**
   * 开始新的对话会话
   */
  const startConversation = async (userId: number, roleId: string, conversationType: string) => {
    try {
      isLoading.value = true
      const response = await fetch(`${API_BASE}/users/${userId}/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId, conversationType })
      })
      
      if (!response.ok) throw new Error('开始对话失败')
      
      const conversation = await response.json()
      currentConversation.value = conversation
      activeConversations.value.unshift(conversation)
      
      // 获取对话历史
      await fetchConversationHistory(conversation.id)
      
      return conversation
    } catch (err) {
      error.value = err instanceof Error ? err.message : '未知错误'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 基于人生事件开始对话
   */
  const startEventBasedConversation = async (userId: number, eventId: number) => {
    try {
      isLoading.value = true
      const response = await fetch(`${API_BASE}/users/${userId}/events/${eventId}/start-conversation`, {
        method: 'POST'
      })
      
      if (!response.ok) throw new Error('开始事件对话失败')
      
      const conversation = await response.json()
      currentConversation.value = conversation
      activeConversations.value.unshift(conversation)
      
      // 获取对话历史
      await fetchConversationHistory(conversation.id)
      
      return conversation
    } catch (err) {
      error.value = err instanceof Error ? err.message : '未知错误'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 发送消息并获取AI回复
   */
  const sendMessage = async (conversationId: number, userId: number, message: string) => {
    try {
      isLoading.value = true
      const response = await fetch(`${API_BASE}/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, message })
      })
      
      if (!response.ok) throw new Error('发送消息失败')
      
      const aiMessage = await response.json()
      
      // 更新对话历史
      await fetchConversationHistory(conversationId)
      
      return aiMessage
    } catch (err) {
      error.value = err instanceof Error ? err.message : '未知错误'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 获取对话历史
   */
  const fetchConversationHistory = async (conversationId: number, limit: number = 50) => {
    try {
      const response = await fetch(`${API_BASE}/conversations/${conversationId}/messages?limit=${limit}`)
      if (!response.ok) throw new Error('获取对话历史失败')
      
      const messages = await response.json()
      conversationHistory.value = messages
      return messages
    } catch (err) {
      error.value = err instanceof Error ? err.message : '未知错误'
      throw err
    }
  }

  /**
   * 切换AI角色
   */
  const switchRole = async (conversationId: number, newRoleId: string, reason: string) => {
    try {
      isLoading.value = true
      const response = await fetch(`${API_BASE}/conversations/${conversationId}/switch-role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newRoleId, reason })
      })
      
      if (!response.ok) throw new Error('切换角色失败')
      
      const newConversation = await response.json()
      currentConversation.value = newConversation
      
      // 更新活跃对话列表
      const index = activeConversations.value.findIndex(c => c.id === conversationId)
      if (index !== -1) {
        activeConversations.value[index].status = 'completed'
      }
      activeConversations.value.unshift(newConversation)
      
      // 获取新对话的历史
      await fetchConversationHistory(newConversation.id)
      
      return newConversation
    } catch (err) {
      error.value = err instanceof Error ? err.message : '未知错误'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 获取用户的所有对话会话
   */
  const fetchUserConversations = async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE}/users/${userId}/conversations`)
      if (!response.ok) throw new Error('获取对话会话失败')
      
      const conversations = await response.json()
      activeConversations.value = conversations
      return conversations
    } catch (err) {
      error.value = err instanceof Error ? err.message : '未知错误'
      throw err
    }
  }

  // ==================== 人生事件管理方法 ====================

  /**
   * 添加人生事件
   */
  const addLifeEvent = async (userId: number, eventData: Partial<LifeEvent>) => {
    try {
      isLoading.value = true
      const response = await fetch(`${API_BASE}/users/${userId}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      })
      
      if (!response.ok) throw new Error('添加人生事件失败')
      
      const event = await response.json()
      userEvents.value.unshift(event)
      
      // 刷新轨迹概览
      await fetchTrajectoryOverview(userId)
      
      return event
    } catch (err) {
      error.value = err instanceof Error ? err.message : '未知错误'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 获取人生轨迹概览
   */
  const fetchTrajectoryOverview = async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE}/users/${userId}/trajectory-overview`)
      if (!response.ok) throw new Error('获取轨迹概览失败')
      
      const overview = await response.json()
      trajectoryOverview.value = overview
      return overview
    } catch (err) {
      error.value = err instanceof Error ? err.message : '未知错误'
      throw err
    }
  }

  /**
   * 获取用户的所有人生事件
   */
  const fetchUserEvents = async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE}/users/${userId}/events`)
      if (!response.ok) throw new Error('获取人生事件失败')
      
      const events = await response.json()
      userEvents.value = events
      return events
    } catch (err) {
      error.value = err instanceof Error ? err.message : '未知错误'
      throw err
    }
  }

  /**
   * 为事件推荐AI角色
   */
  const recommendRolesForEvent = async (event: LifeEvent) => {
    try {
      const response = await fetch(`${API_BASE}/events/recommend-roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      })
      
      if (!response.ok) throw new Error('推荐角色失败')
      
      return await response.json()
    } catch (err) {
      error.value = err instanceof Error ? err.message : '未知错误'
      throw err
    }
  }

  // ==================== 统计和分析方法 ====================

  /**
   * 获取对话统计信息
   */
  const fetchConversationStats = async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE}/users/${userId}/conversation-stats`)
      if (!response.ok) throw new Error('获取对话统计失败')
      
      const stats = await response.json()
      conversationStats.value = stats
      return stats
    } catch (err) {
      error.value = err instanceof Error ? err.message : '未知错误'
      throw err
    }
  }

  /**
   * 获取综合分析报告
   */
  const fetchComprehensiveAnalysis = async (userId: number) => {
    try {
      isLoading.value = true
      const response = await fetch(`${API_BASE}/users/${userId}/comprehensive-analysis`)
      if (!response.ok) throw new Error('获取综合分析失败')
      
      const analysis = await response.json()
      
      // 更新相关状态
      trajectoryOverview.value = analysis.trajectoryOverview
      conversationStats.value = analysis.conversationStats
      primaryMentor.value = analysis.primaryMentor
      
      return analysis
    } catch (err) {
      error.value = err instanceof Error ? err.message : '未知错误'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ==================== 原有的评价和分析方法 ====================

  /**
   * 评价人生事件
   */
  const evaluateEvent = async (eventId: string, eventData: any): Promise<AIEvaluation> => {
    try {
      isLoading.value = true
      error.value = null

      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 2000))

      const evaluation: AIEvaluation = {
        eventId,
        evaluationId: `eval_${Date.now()}`,
        timestamp: new Date().toISOString(),
        status: 'completed',
        analysis: {
          overallScore: Math.floor(Math.random() * 3) + 7,
          emotionalImpact: '这个事件对您的情感状态产生了积极的影响，增强了您的自信心和成就感。',
          growthPotential: '通过这次经历，您在专业技能和人际交往方面都有显著提升的空间。',
          lifeSignificance: '这是您人生轨迹中的一个重要节点，为未来的发展奠定了坚实基础。'
        },
        insights: {
          strengths: ['展现了出色的学习能力', '在压力下保持冷静', '善于团队协作'],
          improvements: ['可以更主动地寻求反馈', '时间管理还有提升空间', '可以培养更多的创新思维'],
          futureOpportunities: ['考虑承担更多领导责任', '探索跨领域合作机会', '建立个人品牌影响力']
        },
        recommendations: {
          immediate: ['记录这次成功的关键因素', '向团队成员表达感谢', '制定下一阶段目标'],
          shortTerm: ['寻找导师进行深度交流', '参加相关技能培训', '扩展专业网络'],
          longTerm: ['考虑职业发展新方向', '建立个人知识体系', '培养行业影响力']
        }
      }

      evaluations[eventId] = evaluation
      return evaluation
    } catch (err) {
      error.value = err instanceof Error ? err.message : '评价失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 分析人生规划
   */
  const analyzePlan = async (planId: string, planData: any): Promise<PlanAnalysis> => {
    try {
      isLoading.value = true
      error.value = null

      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 2500))

      const analysis: PlanAnalysis = {
        planId,
        analysisId: `analysis_${Date.now()}`,
        timestamp: new Date().toISOString(),
        status: 'completed',
        feasibility: {
          overallScore: Math.floor(Math.random() * 2) + 7,
          timeRealistic: Math.floor(Math.random() * 3) + 7,
          resourceAvailability: Math.floor(Math.random() * 3) + 6,
          skillRequirement: Math.floor(Math.random() * 3) + 7,
          marketOpportunity: Math.floor(Math.random() * 3) + 8
        },
        riskAssessment: {
          level: 'medium',
          mainRisks: ['市场竞争激烈', '技术更新换代快', '资源投入较大'],
          mitigationStrategies: ['建立差异化优势', '持续学习新技术', '分阶段投入资源']
        },
        optimization: {
          priorityAdjustments: ['优先完成核心技能培养', '提前建立行业人脉', '制定备选方案'],
          timelineOptimization: ['将长期目标分解为季度里程碑', '预留缓冲时间应对变化', '设置定期评估节点'],
          resourceOptimization: ['利用在线学习平台降低成本', '寻找合作伙伴共享资源', '申请相关资助或奖学金']
        }
      }

      planAnalyses[planId] = analysis
      return analysis
    } catch (err) {
      error.value = err instanceof Error ? err.message : '分析失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ==================== 工具方法 ====================

  /**
   * 清除错误状态
   */
  const clearError = () => {
    error.value = null
  }

  /**
   * 重置所有状态
   */
  const resetState = () => {
    isLoading.value = false
    error.value = null
    currentRole.value = null
    currentConversation.value = null
    conversationHistory.value = []
    Object.keys(evaluations).forEach(key => delete evaluations[key])
    Object.keys(planAnalyses).forEach(key => delete planAnalyses[key])
  }

  return {
    // 状态
    isLoading,
    error,
    availableRoles,
    currentRole,
    userRoleRelationships,
    primaryMentor,
    activeConversations,
    currentConversation,
    conversationHistory,
    conversationStats,
    userEvents,
    trajectoryOverview,
    evaluations,
    planAnalyses,

    // AI角色管理方法
    fetchAvailableRoles,
    fetchRoleInfo,
    setPrimaryMentor,
    fetchUserRoleRelationship,

    // 对话管理方法
    startConversation,
    startEventBasedConversation,
    sendMessage,
    fetchConversationHistory,
    switchRole,
    fetchUserConversations,

    // 人生事件管理方法
    addLifeEvent,
    fetchTrajectoryOverview,
    fetchUserEvents,
    recommendRolesForEvent,

    // 统计和分析方法
    fetchConversationStats,
    fetchComprehensiveAnalysis,

    // 原有方法
    evaluateEvent,
    analyzePlan,
    
    // Getter方法
    getEventEvaluation: (eventId: string) => evaluations[eventId],
    getPlanAnalysis: (planId: string) => planAnalyses[planId],
    getChatHistory: (context: any) => conversationHistory.value,

    // 工具方法
    clearError,
    resetState
  }
})

