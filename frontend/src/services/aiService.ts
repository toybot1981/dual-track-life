import axios from 'axios'

// API基础配置
const API_BASE_URL = 'https://10001-iov2is7nyssq6kem6um0h-04b03c29.manusvm.computer'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
} )

// AI角色定义
export interface AIRole {
  roleId: string
  roleName: string
  description: string
  expertise: string[]
  personality: string
  isActive: boolean
}

// AI消息接口
export interface AIMessage {
  id: number
  conversationId: number
  userId: number
  roleId: string
  messageType: 'user' | 'ai'
  content: string
  timestamp: string
  messageOrder: number
}

// 对话请求接口
export interface ChatRequest {
  roleId?: string
  query: string
  context?: string
}

// 事件分析请求接口
export interface EventAnalysisRequest {
  eventTitle: string
  eventDescription: string
  eventType: string
  userQuery: string
}

// 轨迹分析请求接口
export interface TrajectoryAnalysisRequest {
  userEvents: string
  analysisType: string
}

// 个性化建议请求接口
export interface PersonalizedAdviceRequest {
  userProfile: string
  currentSituation: string
  goals: string
  priority?: string
  timeFrame?: string
  detailLevel?: string
  adviceTypes?: string[]
}

// 情感支持请求接口
export interface EmotionalSupportRequest {
  emotionalState: string
  situation: string
  userMessage: string
}

export class AIService {
  // 获取所有AI角色
  static async getAllRoles(): Promise<AIRole[]> {
    try {
      const response = await apiClient.get('/api/life-agent/roles')
      return response.data
    } catch (error) {
      console.error('获取AI角色失败:', error)
      // 返回默认角色
      return [
        {
          roleId: 'life_mentor',
          roleName: '人生导师',
          description: '专注于人生指导和价值观建议',
          expertise: ['人生规划', '价值观引导', '人生哲学'],
          personality: '智慧、温和、富有洞察力',
          isActive: true
        },
        {
          roleId: 'psychologist',
          roleName: '心理咨询师',
          description: '提供专业的心理疏导和情感支持',
          expertise: ['心理健康', '情感疏导', '压力管理'],
          personality: '专业、同理心强、耐心',
          isActive: true
        },
        {
          roleId: 'career_coach',
          roleName: '职业导师',
          description: '专注于职业规划和发展建议',
          expertise: ['职业规划', '技能发展', '职场策略'],
          personality: '实用、前瞻、专业',
          isActive: true
        },
        {
          roleId: 'life_coach',
          roleName: '生活教练',
          description: '帮助优化生活方式和习惯',
          expertise: ['生活方式', '习惯养成', '健康管理'],
          personality: '积极、实用、激励',
          isActive: true
        },
        {
          roleId: 'philosopher',
          roleName: '哲学家',
          description: '提供深度思考和人生哲理',
          expertise: ['哲学思辨', '人生意义', '深度思考'],
          personality: '深刻、思辨、启发性',
          isActive: true
        }
      ]
    }
  }

  // 基于角色的AI聊天
  static async roleBasedChat(request: ChatRequest) {
    try {
      const response = await apiClient.post('/api/spring-ai/role/chat', request)
      return response.data
    } catch (error) {
      console.error('角色对话失败:', error)
      throw error
    }
  }

  // 简单AI聊天
  static async simpleChat(query: string) {
    try {
      const response = await apiClient.post('/api/spring-ai/simple/chat', { query })
      return response.data
    } catch (error) {
      console.error('简单对话失败:', error)
      throw error
    }
  }

  // 事件分析
  static async eventAnalysis(request: EventAnalysisRequest) {
    try {
      const response = await apiClient.post('/api/spring-ai/event/analysis', request)
      return response.data
    } catch (error) {
      console.error('事件分析失败:', error)
      throw error
    }
  }

  // 轨迹分析
  static async trajectoryAnalysis(request: TrajectoryAnalysisRequest) {
    try {
      const response = await apiClient.post('/api/spring-ai/trajectory/analysis', request)
      return response.data
    } catch (error) {
      console.error('轨迹分析失败:', error)
      throw error
    }
  }

  // 个性化建议
  static async personalizedAdvice(request: PersonalizedAdviceRequest) {
    try {
      const response = await apiClient.post('/api/spring-ai/personalized/advice', request)
      return response.data
    } catch (error) {
      console.error('个性化建议失败:', error)
      throw error
    }
  }

  // 情感支持
  static async emotionalSupport(request: EmotionalSupportRequest) {
    try {
      const response = await apiClient.post('/api/spring-ai/emotional/support', request)
      return response.data
    } catch (error) {
      console.error('情感支持失败:', error)
      throw error
    }
  }

  // 决策支持
  static async decisionSupport(situation: string, options: string[], criteria: string) {
    try {
      const response = await apiClient.post('/api/spring-ai/decision/support', {
        situation,
        options,
        criteria
      })
      return response.data
    } catch (error) {
      console.error('决策支持失败:', error)
      throw error
    }
  }

  // 健康检查
  static async healthCheck() {
    try {
      const response = await apiClient.get('/api/spring-ai/test')
      return response.data
    } catch (error) {
      console.error('AI服务健康检查失败:', error)
      throw error
    }
  }
}

export default AIService
