import axios from 'axios'

// API基础配置 - 使用当前运行的后端地址
const API_BASE_URL = 'https://10002-iq48y0k1ndjxcnwkn4a3m-808b8b71.manusvm.computer'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

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
          description: '经验丰富的人生指导专家，帮助您思考人生方向和价值观',
          expertise: ['人生规划', '价值观引导', '人生哲学', '目标设定'],
          personality: '智慧、温和、富有洞察力',
          isActive: true
        },
        {
          roleId: 'psychologist',
          roleName: '心理咨询师',
          description: '专业的心理健康专家，提供情感疏导和心理支持',
          expertise: ['心理健康', '情感疏导', '压力管理', '认知调节'],
          personality: '专业、同理心强、耐心倾听',
          isActive: true
        },
        {
          roleId: 'career_coach',
          roleName: '职业导师',
          description: '资深的职业发展顾问，助力您的职业成长',
          expertise: ['职业规划', '技能发展', '职场策略', '领导力'],
          personality: '实用、前瞻、专业务实',
          isActive: true
        },
        {
          roleId: 'life_coach',
          roleName: '生活教练',
          description: '专业的生活质量提升专家，帮助您优化生活方式',
          expertise: ['生活方式', '习惯养成', '健康管理', '时间管理'],
          personality: '积极、实用、充满激励',
          isActive: true
        },
        {
          roleId: 'philosopher',
          roleName: '哲学家',
          description: '深度思考的人生哲学家，引导您探索生命的意义',
          expertise: ['哲学思辨', '人生意义', '深度思考', '价值探索'],
          personality: '深刻、思辨、富有启发性',
          isActive: true
        }
      ]
    }
  }

  // 基于角色的AI聊天
  static async roleBasedChat(request: ChatRequest) {
    try {
      // 调用后端的角色聊天接口
      const response = await apiClient.post('/api/spring-ai/role/chat', {
        roleId: request.roleId,
        query: request.query,
        context: request.context || ''
      })
      
      return {
        response: response.data.response || '抱歉，我现在无法回复您的消息。',
        roleId: request.roleId
      }
    } catch (error) {
      console.error('角色对话失败:', error)
      return {
        response: '抱歉，AI服务暂时不可用。请稍后再试。',
        roleId: request.roleId
      }
    }
  }

  // 简单AI聊天
  static async simpleChat(query: string) {
    try {
      // 使用POST请求，匹配后端接口
      const response = await apiClient.post('/api/spring-ai/simple/chat', {
        query: query
      })
      return {
        response: response.data.response || '抱歉，我现在无法回复您的消息。'
      }
    } catch (error) {
      console.error('简单对话失败:', error)
      return {
        response: '抱歉，AI服务暂时不可用。请稍后再试。'
      }
    }
  }

  // 事件分析
  static async eventAnalysis(request: EventAnalysisRequest) {
    try {
      const response = await apiClient.post('/api/spring-ai/event/analysis', {
        eventTitle: request.eventTitle,
        eventDescription: request.eventDescription,
        eventType: request.eventType,
        userQuery: request.userQuery
      })
      return response.data
    } catch (error) {
      console.error('事件分析失败:', error)
      return {
        response: '抱歉，事件分析服务暂时不可用。请稍后再试。'
      }
    }
  }

  // 轨迹分析
  static async trajectoryAnalysis(request: TrajectoryAnalysisRequest) {
    try {
      const response = await apiClient.post('/api/spring-ai/trajectory/analysis', {
        userEvents: request.userEvents,
        analysisType: request.analysisType
      })
      return response.data
    } catch (error) {
      console.error('轨迹分析失败:', error)
      return {
        response: '抱歉，轨迹分析服务暂时不可用。请稍后再试。'
      }
    }
  }

  // 个性化建议
  static async personalizedAdvice(request: PersonalizedAdviceRequest) {
    try {
      const response = await apiClient.post('/api/spring-ai/personalized/advice', {
        userProfile: request.userProfile,
        currentSituation: request.currentSituation,
        goals: request.goals,
        priority: request.priority,
        timeFrame: request.timeFrame
      })
      return response.data
    } catch (error) {
      console.error('个性化建议失败:', error)
      return {
        response: '抱歉，个性化建议服务暂时不可用。请稍后再试。'
      }
    }
  }

  // 情感支持
  static async emotionalSupport(request: EmotionalSupportRequest) {
    try {
      const response = await apiClient.post('/api/spring-ai/emotional/support', {
        emotionalState: request.emotionalState,
        situation: request.situation,
        userMessage: request.userMessage
      })
      return response.data
    } catch (error) {
      console.error('情感支持失败:', error)
      return {
        response: '抱歉，情感支持服务暂时不可用。请稍后再试。'
      }
    }
  }

  // 决策支持
  static async decisionSupport(situation: string, options: string[], criteria: string) {
    try {
      const response = await apiClient.post('/api/spring-ai/decision/support', {
        situation: situation,
        options: options,
        criteria: criteria
      })
      return response.data
    } catch (error) {
      console.error('决策支持失败:', error)
      return {
        response: '抱歉，决策支持服务暂时不可用。请稍后再试。'
      }
    }
  }

  // 健康检查
  static async healthCheck() {
    try {
      const response = await apiClient.get('/api/life-agent/health')
      return response.data
    } catch (error) {
      console.error('AI服务健康检查失败:', error)
      throw error
    }
  }
}

export default AIService

