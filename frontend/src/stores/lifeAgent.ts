import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import AIService from '@/services/aiService'
import { SmartBuffer } from '@/utils/SmartBuffer'

export interface LifeAgentMessage {
  id: string
  userId: string
  message: string
  type: 'user' | 'agent'
  category?: 'planning' | 'evaluation' | 'goal' | 'general'
  timestamp: number
  isStreaming?: boolean // 添加流状态标记
  renderPhase?: 'text' | 'basic' | 'markdown' | 'enhanced' // 渲染阶段
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
    
    // 无论健康检查是否成功，都添加欢迎消息和demo数据
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
      
      // 添加用户demo消息
      const userDemoMessage: LifeAgentMessage = {
        id: generateMessageId(),
        userId: currentUserId.value,
        message: '我想制定一个人生规划',
        type: 'user',
        category: 'planning',
        timestamp: Date.now() + 1000
      }
      messages.value.push(userDemoMessage)
      
      // 添加AI demo回复（包含您提供的文本）
      const aiDemoMessage: LifeAgentMessage = {
        id: generateMessageId(),
        userId: currentUserId.value,
        message: `# 制定人生规划指南

很高兴您决定开始制定个人的人生规划！一个清晰的人生规划可以帮助我们更加明确地知道自己想要什么，以及如何达成这些目标。下面我将为您提供一个系统性的指导框架：

## 1. 自我探索和理解

- **了解自己**：深入思考您的兴趣、价值观、优势和劣势
- **设定愿景**：想象十年甚至更长时间后，您希望自己的生活是怎样的？包括职业发展、家庭关系等方面

## 2. 目标设定

根据您的愿景，设定一些具体可实现的长期目标。例如：
- "成为一名优秀的软件工程师"
- "拥有自己的小企业"

**短期目标**：为达到每个长期目标而设立一年内可达成的小目标，并持续进步。

## 3. 制定行动计划

- 对于每一个短期目标，详细列出需要采取的具体步骤来完成它们
- 为每项任务分配合理的时间框架

## 4. 资源整合与利用

- 思考可以利用哪些现有资源帮助自己更快地达成目标，比如人脉网络、技能特长等
- 如果发现某些方面存在不足，则考虑如何通过学习或其他方式弥补差距

## 5. 定期回顾调整

- 每隔一段时间（建议每季度一次），回过头来看看自己的进展如何
- 根据实际情况调整目标和计划，确保始终朝着正确的发展方向前进

> "成功并不是终点，勇气才是继续前行的真正力量。" ——温斯顿·丘吉尔

记住，在追求梦想的路上难免会遇到挑战和困难，但要保持积极乐观的态度，勇敢面对每一次失败，并从中吸取教训。

希望这份指南能够对您有所帮助！如果在规划过程中有任何疑问或者需要进一步指导，请随时向我咨询。`,
        type: 'agent',
        category: 'planning',
        timestamp: Date.now() + 2000
      }
      messages.value.push(aiDemoMessage)
    }
  }
  // 发送消息
  const sendMessage = async (messageText: string, category: string = 'general') => {
    if (!messageText.trim() || isLoading.value) return
    
    // 添加用户消息
    const userMessage: LifeAgentMessage = {
      id: generateMessageId(),
      userId: currentUserId.value,
      message: messageText.trim(),
      type: 'user',
      category: category as any,
      timestamp: Date.now(),
      renderPhase: 'markdown'
    }
    messages.value.push(userMessage)
    
    isLoading.value = true
    
    try {
      // 创建智能缓冲器
      const smartBuffer = new SmartBuffer()
      
      // 流式调用AI服务
      const agentMessage: LifeAgentMessage = {
        id: generateMessageId(),
        userId: currentUserId.value,
        message: '',
        type: 'agent',
        category: category as any,
        timestamp: Date.now(),
        isStreaming: true, // 流状态标记
        renderPhase: 'text' // 流式时使用文本渲染
      }
      messages.value.push(agentMessage)
      
      let lastUpdateTime = Date.now()
      const updateThrottle = 100 // 100ms更新间隔，避免过于频繁的DOM更新
      
      await AIService.roleBasedStreamChat({
        roleId: currentRoleId.value,
        query: messageText,
        context: getConversationContext()
      }, (chunk) => {
        // 使用智能缓冲器处理数据块
        const renderableContent = smartBuffer.addChunk(chunk)
        
        // 节流更新，避免过于频繁的DOM操作
        const now = Date.now()
        if (renderableContent && (now - lastUpdateTime > updateThrottle)) {
          // 更新消息内容（使用智能缓冲的安全内容）
          agentMessage.message = renderableContent
          
          // 触发响应式更新
          messages.value = [...messages.value]
          lastUpdateTime = now
        } else if (!renderableContent) {
          // 如果没有安全渲染点，显示完整缓冲内容（但保持文本模式）
          agentMessage.message = smartBuffer.getFullContent()
          
          if (now - lastUpdateTime > updateThrottle) {
            messages.value = [...messages.value]
            lastUpdateTime = now
          }
        }
      })
      
      // 流结束后，进行完整的markdown处理
      const finalContent = smartBuffer.getFullContent()
      
      // 基础文本清理
      const cleanedContent = finalContent
        // 标点符号不分离
        .replace(/([^\s])\s*\n\s*([？！。，；：、])/g, '$1$2')
        // 清理多余空格
        .replace(/[ \t]+/g, ' ')
        .replace(/[ \t]+$/gm, '')
        // 确保段落间有适当间距
        .replace(/\n{3,}/g, '\n\n')
      
      // 更新为最终处理后的内容并切换到markdown渲染模式
      agentMessage.message = cleanedContent
      agentMessage.isStreaming = false
      agentMessage.renderPhase = 'markdown'
      
      // 最终更新
      messages.value = [...messages.value]
      
      // 输出缓冲器统计信息（调试用）
      const stats = smartBuffer.getStats()
      console.log('SmartBuffer Stats:', stats)
      
    } catch (error) {
      console.error('发送消息失败:', error)
      // 添加错误消息
      const errorMessage: LifeAgentMessage = {
        id: generateMessageId(),
        userId: currentUserId.value,
        message: '抱歉，我现在无法回复您的消息。请稍后再试。',
        type: 'agent',
        category: 'general',
        timestamp: Date.now(),
        renderPhase: 'markdown'
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

