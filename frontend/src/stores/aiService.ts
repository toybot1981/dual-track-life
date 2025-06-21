import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'

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

export interface ChatMessage {
  messageId: string
  timestamp: string
  type: 'user' | 'ai'
  message: string
  suggestions?: string[]
  eventId?: string
  planId?: string
}

export const useAIStore = defineStore('ai', () => {
  const isConnected = ref(true)
  const isLoading = ref(false)
  const evaluations = reactive<Map<string, AIEvaluation>>(new Map())
  const analyses = reactive<Map<string, PlanAnalysis>>(new Map())
  const chatHistory = ref<ChatMessage[]>([])

  // 模拟API延迟
  const simulateDelay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms))

  // 事件AI评价
  const evaluateEvent = async (eventId: string, eventData: any): Promise<AIEvaluation> => {
    isLoading.value = true
    
    try {
      await simulateDelay(1500)
      
      const evaluation: AIEvaluation = {
        eventId,
        evaluationId: `eval_${Date.now()}`,
        timestamp: new Date().toISOString(),
        status: 'completed',
        analysis: {
          overallScore: 8.5,
          emotionalImpact: '积极',
          growthPotential: '高',
          lifeSignificance: '重要'
        },
        insights: {
          strengths: [
            '展现了出色的领导能力和团队协作精神',
            '在压力下保持冷静，体现了良好的心理素质',
            '通过这次经历获得了宝贵的实践经验'
          ],
          improvements: [
            '可以进一步提升沟通技巧，更好地表达想法',
            '建议在类似场合中更加主动地承担责任',
            '考虑将这次经验应用到其他领域'
          ],
          futureOpportunities: [
            '这次成功为未来的职业发展奠定了基础',
            '可以考虑在相关领域寻求更多挑战',
            '建议分享经验，帮助他人成长'
          ]
        },
        recommendations: {
          immediate: [
            '记录下这次经历的关键学习点',
            '与团队成员保持联系，维护良好关系',
            '准备在简历中突出这次成就'
          ],
          shortTerm: [
            '寻找类似的项目或机会来巩固技能',
            '考虑获得相关的专业认证',
            '建立个人品牌和专业网络'
          ],
          longTerm: [
            '制定职业发展规划，明确下一步目标',
            '考虑在这个领域深入发展或转向管理角色',
            '思考如何将这次经验转化为长期优势'
          ]
        }
      }
      
      evaluations.set(eventId, evaluation)
      return evaluation
    } finally {
      isLoading.value = false
    }
  }

  // 获取事件评价
  const getEventEvaluation = (eventId: string): AIEvaluation | null => {
    return evaluations.get(eventId) || null
  }

  // 虚拟人生规划AI分析
  const analyzePlan = async (planId: string, planData: any): Promise<PlanAnalysis> => {
    isLoading.value = true
    
    try {
      await simulateDelay(2000)
      
      const analysis: PlanAnalysis = {
        planId,
        analysisId: `analysis_${Date.now()}`,
        timestamp: new Date().toISOString(),
        status: 'completed',
        feasibility: {
          overallScore: 7.8,
          timeRealistic: 8.0,
          resourceAvailability: 7.5,
          skillRequirement: 8.2,
          marketOpportunity: 7.6
        },
        riskAssessment: {
          level: '中等',
          mainRisks: [
            '市场竞争激烈，需要差异化策略',
            '技能提升需要时间投入，可能影响短期收入',
            '行业变化快速，需要持续学习适应'
          ],
          mitigationStrategies: [
            '制定详细的学习计划，分阶段提升技能',
            '建立多元化的收入来源，降低风险',
            '保持行业敏感度，及时调整策略'
          ]
        },
        optimization: {
          priorityAdjustments: [
            '优先发展核心技能，建立竞争优势',
            '加强网络建设，扩大专业影响力',
            '考虑与现有经验结合，创造独特价值'
          ],
          timelineOptimization: [
            '将长期目标分解为可执行的短期里程碑',
            '预留缓冲时间应对不可预见的挑战',
            '设置定期评估点，及时调整计划'
          ],
          resourceOptimization: [
            '充分利用现有资源和人脉关系',
            '寻找成本效益最高的学习和发展途径',
            '考虑合作伙伴关系，共享资源和风险'
          ]
        }
      }
      
      analyses.set(planId, analysis)
      return analysis
    } finally {
      isLoading.value = false
    }
  }

  // 获取规划分析
  const getPlanAnalysis = (planId: string): PlanAnalysis | null => {
    return analyses.get(planId) || null
  }

  // AI对话
  const sendMessage = async (message: string, context?: { eventId?: string, planId?: string }): Promise<ChatMessage> => {
    isLoading.value = true
    
    // 添加用户消息
    const userMessage: ChatMessage = {
      messageId: `msg_${Date.now()}_user`,
      timestamp: new Date().toISOString(),
      type: 'user',
      message,
      ...context
    }
    chatHistory.value.push(userMessage)
    
    try {
      await simulateDelay(1000)
      
      // 生成AI响应
      const aiResponse = generateAIResponse(message, context)
      const aiMessage: ChatMessage = {
        messageId: `msg_${Date.now()}_ai`,
        timestamp: new Date().toISOString(),
        type: 'ai',
        message: aiResponse.message,
        suggestions: aiResponse.suggestions,
        ...context
      }
      
      chatHistory.value.push(aiMessage)
      return aiMessage
    } finally {
      isLoading.value = false
    }
  }

  // 生成AI响应
  const generateAIResponse = (userMessage: string, context?: { eventId?: string, planId?: string }) => {
    if (context?.eventId) {
      return generateEventChatResponse(userMessage, context.eventId)
    } else if (context?.planId) {
      return generatePlanChatResponse(userMessage, context.planId)
    } else {
      return generateGeneralChatResponse(userMessage)
    }
  }

  // 事件相关对话响应
  const generateEventChatResponse = (userMessage: string, eventId: string) => {
    if (userMessage.includes('影响') || userMessage.includes('意义')) {
      return {
        message: '这个事件对您的人生具有重要意义。从长远来看，它不仅提升了您的专业能力，更重要的是培养了您面对挑战的勇气和解决问题的思维方式。这种经历会成为您未来职业发展的重要资产，建议您将其中的关键学习点记录下来，并思考如何在未来的工作中应用这些经验。',
        suggestions: [
          '您想了解这个事件对职业发展的具体影响吗？',
          '我可以帮您分析如何将这次经验转化为竞争优势',
          '要不要探讨一下类似经历的最佳实践？'
        ]
      }
    } else if (userMessage.includes('建议') || userMessage.includes('下一步')) {
      return {
        message: '基于这次经历，我建议您：1）总结并记录这次成功的关键因素；2）主动寻找类似的挑战机会来巩固和发展这些技能；3）与参与这次事件的同事保持良好关系，他们可能成为您未来的重要人脉；4）考虑将这次经验写入您的职业档案，为未来的机会做准备。您觉得哪个方面最需要优先关注？',
        suggestions: [
          '我想了解如何记录和总结这次经历',
          '如何寻找类似的挑战机会？',
          '怎样维护和发展职业人脉关系？'
        ]
      }
    } else if (userMessage.includes('感受') || userMessage.includes('情感')) {
      return {
        message: '从您的描述中，我能感受到这次经历带给您的成就感和自信心的提升。这种积极的情感体验非常宝贵，它不仅证明了您的能力，也为您未来面对类似挑战提供了心理支撑。建议您在感到压力或怀疑时，回想这次成功的经历，它会成为您前进的动力源泉。',
        suggestions: [
          '如何保持和延续这种积极的心态？',
          '怎样将成功经验转化为自信心？',
          '面对未来挑战时如何调节心理状态？'
        ]
      }
    } else {
      return {
        message: '我理解您对这个事件的关注。这确实是一次很有价值的经历，展现了您的潜力和成长空间。如果您想深入探讨某个特定方面，比如这次经历对您技能发展的影响，或者如何将学到的经验应用到未来的挑战中，我很乐意为您提供更详细的分析和建议。',
        suggestions: [
          '这次经历对我的技能发展有什么影响？',
          '如何将经验应用到未来的挑战中？',
          '我想了解更多关于个人成长的建议'
        ]
      }
    }
  }

  // 规划相关对话响应
  const generatePlanChatResponse = (userMessage: string, planId: string) => {
    if (userMessage.includes('可行性') || userMessage.includes('实现')) {
      return {
        message: '从可行性角度来看，您的规划具有很好的基础。关键在于合理的时间安排和资源配置。我建议将大目标分解为具体的里程碑，每个阶段都设定明确的成功标准。同时，要为不可预见的挑战预留缓冲时间。您目前最担心的是哪个方面的可行性？',
        suggestions: [
          '如何制定详细的时间安排？',
          '怎样合理配置和利用资源？',
          '如何设定阶段性的成功标准？'
        ]
      }
    } else if (userMessage.includes('风险') || userMessage.includes('挑战')) {
      return {
        message: '任何有价值的规划都会面临一定的风险和挑战，这是正常的。主要风险包括市场变化、技能差距和时间压力。但这些都是可以通过合理的策略来管理的。比如，保持学习的敏捷性、建立多元化的技能组合、制定备选方案等。您觉得哪个风险对您来说最需要重点关注？',
        suggestions: [
          '如何应对市场变化的风险？',
          '怎样快速弥补技能差距？',
          '如何制定有效的备选方案？'
        ]
      }
    } else if (userMessage.includes('优化') || userMessage.includes('改进')) {
      return {
        message: '优化规划是一个持续的过程。基于当前分析，我建议从三个方面进行优化：1）时间线优化 - 确保各阶段的时间安排合理且有弹性；2）资源优化 - 最大化利用现有资源，寻找成本效益最高的发展路径；3）策略优化 - 根据市场反馈和个人进展及时调整策略。您希望我详细解释哪个方面的优化建议？',
        suggestions: [
          '详细了解时间线优化策略',
          '如何进行资源优化配置？',
          '策略优化的具体方法是什么？'
        ]
      }
    } else {
      return {
        message: '您的规划展现了清晰的思路和积极的态度。成功的关键在于坚持执行和灵活调整。我建议您定期回顾和评估进展，及时识别需要调整的地方。同时，保持开放的心态，从每个阶段的经历中学习和成长。有什么具体的执行细节您想要深入讨论的吗？',
        suggestions: [
          '如何制定有效的执行计划？',
          '怎样进行定期回顾和评估？',
          '如何保持执行过程中的动力？'
        ]
      }
    }
  }

  // 通用对话响应
  const generateGeneralChatResponse = (userMessage: string) => {
    if (userMessage.includes('规划') || userMessage.includes('计划')) {
      return {
        message: '制定人生规划是一个非常有意义的过程。好的规划应该结合您的兴趣、能力、价值观和外部机会。我可以帮您从目标设定、现状分析、路径规划和风险评估等方面来思考。您希望从哪个方面开始讨论？',
        suggestions: [
          '如何进行有效的目标设定？',
          '怎样分析当前的现状和资源？',
          '如何制定可行的路径规划？'
        ]
      }
    } else if (userMessage.includes('评价') || userMessage.includes('分析')) {
      return {
        message: '我很乐意帮您进行分析和评价。为了提供更准确的建议，我需要了解更多背景信息。您是希望我评价某个具体的人生事件，还是分析某个规划的可行性？或者您有其他特定的分析需求？',
        suggestions: [
          '我想评价一个重要的人生事件',
          '我需要分析一个虚拟人生规划',
          '我想了解个人发展的建议'
        ]
      }
    } else if (userMessage.includes('你好') || userMessage.toLowerCase().includes('hello')) {
      return {
        message: '您好！我是您的人生智能助手，专门帮助您分析人生事件、制定规划和提供个性化建议。我可以帮您：1）评价和分析人生事件的意义和影响；2）分析虚拟人生规划的可行性；3）提供个性化的发展建议；4）进行深度的人生话题讨论。有什么我可以帮助您的吗？',
        suggestions: [
          '我想分析一个重要的人生事件',
          '我需要制定一个人生规划',
          '我想了解个人发展的建议'
        ]
      }
    } else {
      return {
        message: '我理解您的想法。作为您的人生智能助手，我致力于为您提供有价值的洞察和建议。无论是分析过去的经历、规划未来的发展，还是解决当前的困惑，我都会尽力帮助您。请告诉我您最关心的问题，我们可以深入探讨。',
        suggestions: [
          '我想讨论职业发展问题',
          '我需要人生规划的建议',
          '我想了解如何提升个人能力'
        ]
      }
    }
  }

  // 清空对话历史
  const clearChatHistory = () => {
    chatHistory.value = []
  }

  // 获取对话历史
  const getChatHistory = (context?: { eventId?: string, planId?: string }) => {
    if (!context) return chatHistory.value
    
    return chatHistory.value.filter(msg => {
      if (context.eventId) return msg.eventId === context.eventId
      if (context.planId) return msg.planId === context.planId
      return false
    })
  }

  return {
    isConnected,
    isLoading,
    evaluations,
    analyses,
    chatHistory,
    evaluateEvent,
    getEventEvaluation,
    analyzePlan,
    getPlanAnalysis,
    sendMessage,
    clearChatHistory,
    getChatHistory
  }
})

